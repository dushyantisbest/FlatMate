import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Listing from "./models/listing.model.js";
import Review from "./models/review.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "Flatmate";

const sampleListingsData = [
  {
    title: "Spacious Private Room in Luxury 2BHK | Indiranagar",
    description: "Looking for a chill flatmate to share a fully-furnished 2BHK in Indiranagar. Walking distance from 100ft road cafes and metro. High-speed fiber WiFi, modular kitchen, daily maid, and washing machine included. Non-smoker preferred.",
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_indiranagar"
    },
    price: 18000,
    location: "Indiranagar, Bangalore",
    country: "India",
    category: "2BHK",
    roomType: "Private Room",
    genderPreference: "Any",
    furnishing: "Furnished",
    amenities: ["High-speed WiFi", "AC", "Modular Kitchen", "Washing Machine", "Power Backup"],
    geometry: {
      type: "Point",
      coordinates: [77.6412, 12.9784] // Indiranagar, Bangalore
    }
  },
  {
    title: "Sea-Facing Master Bedroom in 3BHK | Bandra West",
    description: "Dream space in Bandra West! Master bedroom with attached balcony and private washroom available. Apartment has sunset sea views, modern modular kitchen, and building gym. Looking for a working professional.",
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_bandra"
    },
    price: 32000,
    location: "Bandra West, Mumbai",
    country: "India",
    category: "3BHK",
    roomType: "Single Room",
    genderPreference: "Female only",
    furnishing: "Furnished",
    amenities: ["Sea View", "AC", "Attached Washroom", "Gym", "Security 24/7"],
    geometry: {
      type: "Point",
      coordinates: [72.8295, 19.0596] // Bandra West, Mumbai
    }
  },
  {
    title: "Chic Studio Apartment Near Metro | Hauz Khas",
    description: "Entire compact studio flat available in Hauz Khas. Wooden flooring, floor-to-ceiling windows, king bed, and private kitchen space. 5 mins walk to yellow line metro and Hauz Khas deer park.",
    image: {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_hauzkhas"
    },
    price: 24000,
    location: "Hauz Khas, New Delhi",
    country: "India",
    category: "studio",
    roomType: "Entire Flat",
    genderPreference: "No Preference",
    furnishing: "Furnished",
    amenities: ["Metro Nearby", "AC", "WiFi", "Balcony", "Fridge"],
    geometry: {
      type: "Point",
      coordinates: [77.2023, 28.5494] // Hauz Khas, Delhi
    }
  },
  {
    title: "Cozy Shared Room for Tech Professional | HSR Layout",
    description: "Sharing room available in a premium 3BHK duplex in HSR Sector 2. Quiet neighborhood, ideal for remote tech workers. Dedicated work desk, ergonomic chair, and cook who prepares North & South Indian meals.",
    image: {
      url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_hsr"
    },
    price: 12500,
    location: "HSR Layout, Bangalore",
    country: "India",
    category: "3BHK",
    roomType: "Shared Room",
    genderPreference: "Male only",
    furnishing: "Furnished",
    amenities: ["Dedicated Cook", "Work Desk", "WiFi", "Washing Machine", "Geyser"],
    geometry: {
      type: "Point",
      coordinates: [77.6389, 12.9121] // HSR Layout, Bangalore
    }
  },
  {
    title: "Modern 1BHK Flat Near Cyber Hub | DLF Phase 2",
    description: "Fully-furnished independent 1BHK in DLF Phase 2. Just 5 mins from Cyber Hub and Rapid Metro. Comes with TV, sofa, king-sized bed, microwave, and covered car parking.",
    image: {
      url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_gurgaon"
    },
    price: 26000,
    location: "DLF Phase 2, Gurgaon",
    country: "India",
    category: "1BHK",
    roomType: "Entire Flat",
    genderPreference: "Any",
    furnishing: "Furnished",
    amenities: ["Car Parking", "Smart TV", "Microwave", "Security", "AC"],
    geometry: {
      type: "Point",
      coordinates: [77.0886, 28.4950] // Gurgaon
    }
  },
  {
    title: "Sunlit Room in Bohemian 2BHK | Koregaon Park",
    description: "Sunny private room in Koregaon Park with lush green garden views. Stone throw from Osho Teerth Park and famous cafes. Peaceful and creative household looking for an open-minded roommate.",
    image: {
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_koregaon"
    },
    price: 15500,
    location: "Koregaon Park, Pune",
    country: "India",
    category: "2BHK",
    roomType: "Private Room",
    genderPreference: "Female only",
    furnishing: "Semi-Furnished",
    amenities: ["Garden View", "WiFi", "Kitchen Access", "Pet Friendly"],
    geometry: {
      type: "Point",
      coordinates: [73.8967, 18.5362] // Pune
    }
  },
  {
    title: "Luxury Penthouse Room with Private Terrace | Jubilee Hills",
    description: "Top floor penthouse room with direct access to a 500 sqft private rooftop terrace in Jubilee Hills Road No. 36. Panoramic city skyline views, jacuzzi, and dedicated security.",
    image: {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_hyderabad"
    },
    price: 38000,
    location: "Jubilee Hills, Hyderabad",
    country: "India",
    category: "penthouse",
    roomType: "Single Room",
    genderPreference: "Any",
    furnishing: "Furnished",
    amenities: ["Private Terrace", "Skyline Views", "Jacuzzi", "AC", "Covered Parking"],
    geometry: {
      type: "Point",
      coordinates: [78.4011, 17.4319] // Hyderabad
    }
  },
  {
    title: "High-Rise Master Suite | Hiranandani Gardens Powai",
    description: "Private room with floor-to-ceiling windows on the 18th floor in Powai. Overlooking the lake and central avenue. Society has clubhouse, olympic swimming pool, and tennis courts.",
    image: {
      url: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_powai"
    },
    price: 28000,
    location: "Powai, Mumbai",
    country: "India",
    category: "3BHK",
    roomType: "Private Room",
    genderPreference: "Any",
    furnishing: "Furnished",
    amenities: ["Swimming Pool", "Clubhouse", "Lake View", "Tennis Court", "AC"],
    geometry: {
      type: "Point",
      coordinates: [72.9056, 19.1176] // Powai, Mumbai
    }
  },
  {
    title: "Budget-Friendly Flatmate Room | Koramangala 4th Block",
    description: "Looking for an easygoing flatmate to share a 2BHK flat in Koramangala 4th Block. Walking distance from Sony World junction. Clean room with double bed, wardrobe, and attached bathroom.",
    image: {
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_koramangala"
    },
    price: 14000,
    location: "Koramangala, Bangalore",
    country: "India",
    category: "2BHK",
    roomType: "Private Room",
    genderPreference: "Any",
    furnishing: "Furnished",
    amenities: ["WiFi", "Wardrobe", "Attached Bathroom", "Bike Parking", "Refrigerator"],
    geometry: {
      type: "Point",
      coordinates: [77.6271, 12.9352] // Koramangala, Bangalore
    }
  },
  {
    title: "Charming 1BHK Garden Flat | Saket",
    description: "Peaceful ground-floor 1BHK with private front garden in Saket. Safe gated society, 2 mins from Select Citywalk and Saket metro. Pet-friendly and fully furnished.",
    image: {
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      filename: "flatmate_saket"
    },
    price: 22000,
    location: "Saket, New Delhi",
    country: "India",
    category: "1BHK",
    roomType: "Entire Flat",
    genderPreference: "No Preference",
    furnishing: "Furnished",
    amenities: ["Private Garden", "Pet Friendly", "Metro 2 mins", "Gated Society", "AC"],
    geometry: {
      type: "Point",
      coordinates: [77.2066, 28.5245] // Saket, Delhi
    }
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("MongoDB Connected Successfully!");

    console.log("Clearing existing listings, reviews, conversations, and messages...");
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    console.log("Setting up demo users...");
    const demoUserData = [
      { username: "arjun", email: "arjun@flatmate.com" },
      { username: "priya", email: "priya@flatmate.com" },
      { username: "rohan", email: "rohan@flatmate.com" },
      { username: "ananya", email: "ananya@flatmate.com" },
    ];

    const users = [];
    for (const u of demoUserData) {
      let existing = await User.findOne({ username: u.username });
      if (!existing) {
        existing = await User.register(new User({ username: u.username, email: u.email }), "password123");
        console.log(`Created user: ${u.username} (password: password123)`);
      } else {
        console.log(`Using existing user: ${u.username}`);
      }
      users.push(existing);
    }

    console.log("Injecting 10 new realistic flatmate listings with Mapbox coordinates...");
    const createdListings = [];
    for (let i = 0; i < sampleListingsData.length; i++) {
      const data = sampleListingsData[i];
      const assignedOwner = users[i % users.length];

      const newListing = new Listing({
        ...data,
        owner: assignedOwner._id,
      });

      // Add a couple of realistic reviews
      const reviewer = users[(i + 1) % users.length];
      const review = new Review({
        comment: i % 2 === 0 
          ? "Great vibe! The apartment is clean, bright, and very close to public transit. Roommate is super respectful and friendly." 
          : "Loved staying here. Reliable high-speed WiFi and safe society. The kitchen is fully equipped.",
        rating: 5,
        createdBy: reviewer._id,
      });
      await review.save();

      newListing.reviews.push(review._id);
      await newListing.save();
      createdListings.push(newListing);
    }

    console.log(`Inserted ${createdListings.length} flatmate listings with reviews!`);

    // Create a demo conversation between arjun and priya for testing real-time chat
    if (users.length >= 2 && createdListings.length > 0) {
      console.log("Creating demo real-time chat conversation...");
      const conv = new Conversation({
        participants: [users[0]._id, users[1]._id],
        listing: createdListings[0]._id,
        lastMessage: {
          text: "Hi! Is the room still available for next month?",
          sender: users[1]._id,
          timestamp: new Date()
        }
      });
      await conv.save();

      const msg1 = new Message({
        conversation: conv._id,
        sender: users[1]._id,
        text: "Hi! Is the room still available for next month?"
      });
      await msg1.save();

      const msg2 = new Message({
        conversation: conv._id,
        sender: users[0]._id,
        text: "Hey Priya! Yes, it's available. Would you like to schedule a quick video tour or visit this weekend?"
      });
      await msg2.save();
      console.log("Demo conversation seeded between arjun and priya!");
    }

    console.log("\n============================================================");
    console.log("DATABASE SEED COMPLETE!");
    console.log("============================================================");
    console.log("DEMO LOGIN CREDENTIALS:");
    console.log("  Username: arjun   | Password: password123");
    console.log("  Username: priya   | Password: password123");
    console.log("  Username: rohan   | Password: password123");
    console.log("  Username: ananya  | Password: password123");
    console.log("============================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
