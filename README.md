# Flatmate

## Description

Flatmate is a full-stack web application designed for listing and managing hostel accommodations. Users can browse, add, edit, and review listings, as well as manage user accounts with authentication. The app facilitates finding and sharing information about available flats or hostels for potential roommates or tenants.

## Features

- **User Authentication**: Sign up, login, and logout functionality using Passport.js with local strategy.
- **Listing Management**: Create, read, update, and delete (CRUD) hostel listings with images, prices, locations, and descriptions.
- **Reviews System**: Users can leave reviews on listings, with automatic cleanup when listings are deleted.
- **Responsive Design**: Built with Bootstrap for mobile-friendly UI.
- **Flash Messages**: User feedback for actions like successful login or errors.
- **Session Management**: Secure session handling with Express Session.
- **Data Validation**: Server-side validation using Joi for input sanitization.
- **Image Handling**: Support for image uploads with default placeholders.
- **Error Handling**: Custom error pages and middleware for robust error management.
- **Deployment Ready**: Configured for deployment on Vercel.

## Tech Stack

### Backend

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building RESTful APIs and handling HTTP requests.
- **MongoDB**: NoSQL database for storing user data, listings, and reviews.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB, providing schema validation and middleware.

### Frontend

- **EJS (Embedded JavaScript Templates)**: Templating engine for rendering dynamic HTML.
- **EJS-Mate**: Layout engine for EJS to enable template inheritance and reusable components.
- **Bootstrap 5**: CSS framework for responsive and modern UI components.
- **Vanilla JavaScript**: Custom client-side scripts for interactivity (e.g., theme toggle, form handling).

### Authentication & Security

- **Passport.js**: Authentication middleware with local strategy.
- **Passport-Local-Mongoose**: Mongoose plugin for simplifying local authentication.
- **Express-Session**: Session management for user state.
- **Connect-Flash**: Flash message system for temporary user notifications.
- **Dotenv**: Environment variable management for sensitive data like database URIs and secrets.

### Validation & Utilities

- **Joi**: Schema validation for request data.
- **Method-Override**: Middleware to support HTTP methods like PUT and DELETE in forms.
- **Custom Middleware**: Async wrapper and error handling utilities for cleaner code.

### Development & Deployment

- **Nodemon**: Development tool for auto-restarting the server on file changes.
- **Vercel**: Cloud platform for deployment, with configuration in `vercel.json`.
- **ES Modules**: Modern JavaScript module system (type: "module" in package.json).

### Third-Party Technologies

- **Bootstrap Icons**: Included via Bootstrap for UI icons.
- **Starability CSS**: Custom CSS for star rating components in reviews.
- **Placeholder Images**: Via placeholder.com for default listing images.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd Flatmate
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL=<your-mongodb-connection-string>
   SECRET=<your-session-secret>
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running locally or provide a cloud MongoDB URI.

5. **Run the Application**:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

6. **Access the App**:
   Open `http://localhost:3000` in your browser (assuming default port).

## Usage

- **Home Page**: Browse available listings.
- **Sign Up/Login**: Create an account or log in to manage listings and reviews.
- **Add Listing**: Authenticated users can add new hostel listings.
- **Edit/Delete Listings**: Owners can modify or remove their listings.
- **Leave Reviews**: Users can review listings.
- **Responsive UI**: Works on desktop and mobile devices.

## Project Structure

```
Flatmate/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── db.js                  # MongoDB connection
├── init.js                # Database initialization
├── middleware.js          # Custom middleware
├── schemaValidation.js    # Joi validation schemas
├── vercel.json            # Vercel deployment config
├── package.json           # Dependencies and scripts
├── controller/            # Route controllers
│   ├── listing.controller.js
│   ├── review.controller.js
│   └── user.controller.js
├── models/                # Mongoose models
│   ├── listing.model.js
│   ├── review.model.js
│   └── user.model.js
├── routes/                # Express routes
│   ├── listingRoute.js
│   ├── reviewRoute.js
│   └── userRoute.js
├── utils/                 # Utility functions
│   ├── asyncWraper.js
│   └── ErrorHandling.js
├── views/                 # EJS templates
│   ├── error.ejs
│   ├── landing.ejs
│   ├── includes/          # Partial templates
│   ├── layout/            # Layout templates
│   ├── listings/          # Listing-related views
│   └── user/              # User-related views
├── public/                # Static assets
│   ├── css/               # Stylesheets (Bootstrap, custom)
│   ├── js/                # JavaScript files (Bootstrap, custom)
│   ├── disable_validation.js
│   ├── starability.css
│   ├── style.css
│   └── theme-toggle.js
└── Flatmate.listings.json # Sample data
```

## API Endpoints

### Listings

- `GET /listings` - Get all listings
- `GET /listings/:id` - Get a specific listing
- `POST /listings` - Create a new listing (authenticated)
- `PUT /listings/:id` - Update a listing (owner only)
- `DELETE /listings/:id` - Delete a listing (owner only)

### Reviews

- `POST /listings/:id/reviews` - Add a review to a listing (authenticated)
- `DELETE /listings/:id/reviews/:reviewId` - Delete a review (reviewer only)

### Users

- `GET /signup` - Sign up form
- `POST /signup` - Create user account
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## Deployment

The app is configured for deployment on Vercel. Ensure your environment variables are set in Vercel's dashboard. The `vercel.json` file handles the build and routing configuration.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Author

Dushyant Kumar Sharma

## Acknowledgments

- Bootstrap for UI components
- Mongoose for MongoDB integration
- Passport.js for authentication
- EJS for templating
