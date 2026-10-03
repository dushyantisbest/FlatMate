import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import asyncWrapper from "../utils/asyncWraper.js";
import ErrorHandlingExpress from "../utils/ErrorHandling.js";
import { getIO } from "../utils/socket.js";

export const getConversations = asyncWrapper(async (req, res) => {
  const userId = req.user._id;
  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "username")
    .populate("listing", "title")
    .sort({ updatedAt: -1 });
  res.render("chat/inbox.ejs", { conversations });
});

export const getOrCreateConversation = asyncWrapper(async (req, res) => {
  const { listingId, recipientId } = req.body;
  const userId = req.user._id;

  if (userId.toString() === recipientId.toString()) {
    throw new ErrorHandlingExpress(400, "You cannot chat with yourself");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] },
    listing: listingId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, recipientId],
      listing: listingId,
    });
  }

  res.redirect(`/chat/${conversation._id}/messages`);
});

export const getMessages = asyncWrapper(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await Conversation.findById(conversationId)
    .populate("participants", "username")
    .populate("listing", "title");

  if (!conversation) {
    throw new ErrorHandlingExpress(404, "Conversation not found");
  }

  if (!conversation.participants.some((p) => p._id.toString() === userId.toString())) {
    throw new ErrorHandlingExpress(403, "You are not a participant in this conversation");
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "username")
    .sort({ createdAt: 1 });

  res.render("chat/room.ejs", { conversation, messages });
});

export const sendMessage = asyncWrapper(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text || !text.trim()) {
    throw new ErrorHandlingExpress(400, "Message text is required");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ErrorHandlingExpress(404, "Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    text,
  });

  await message.populate("sender", "username");

  conversation.lastMessage = {
    text,
    sender: userId,
    timestamp: new Date(),
  };
  conversation.updatedAt = new Date();
  await conversation.save();

  const io = getIO();
  io.to(conversationId).emit("receiveMessage", message);

  res.status(200).json(message);
});
