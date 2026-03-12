# Boundry Backend

## Description

Boundry Backend is the server-side component of the Boundry platform, a comprehensive real estate listing application. It provides a robust RESTful API for managing user authentication, property listings, user profiles, and administrative functions. The backend handles user registration, login, property creation and management, image uploads, and admin moderation of listings.

## Features

- **User Authentication**: Secure registration, login, logout, and JWT-based session management.
- **Property Listings**: Create, read, update, delete (CRUD) operations for property listings with image uploads.
- **User Profiles**: Manage user profiles, including public and private profile views.
- **Admin Panel**: Administrative controls for approving/rejecting listings, managing users, and changing user roles.
- **Image Management**: Cloud-based image storage and optimization using Cloudinary.
- **Ownership Verification**: Middleware to ensure users can only modify their own listings.
- **CORS Support**: Configured for cross-origin requests from frontend applications.
- **Database Integration**: MongoDB with Mongoose for data persistence.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcrypt for password hashing
- **File Uploads**: Multer for handling multipart/form-data, Cloudinary for cloud storage
- **Security**: HTTP-only cookies, CORS configuration
- **Environment Management**: dotenv for configuration

## How It Works

The backend is built with Express.js and follows a modular architecture:

1. **Entry Point**: `index.js` sets up the Express app, connects to MongoDB, and mounts routes.
2. **Routes**: Organized into separate modules for authentication, users, listings, and admin functions.
3. **Controllers**: Handle business logic for each route, interacting with models and utilities.
4. **Models**: Define data schemas using Mongoose for users and listings.
5. **Middleware**: Includes authentication, ownership checks, and file upload handling.
6. **Utilities**: Helper functions for JWT generation, password hashing, query building, and Cloudinary integration.

The API uses RESTful conventions with JSON responses. Authentication is handled via JWT tokens stored in HTTP-only cookies for security.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager
### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Raza-Aziz/Boundry-Backend.git
   cd Boundry-Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add the required environment variables (see Environment Variables section).

4. **Start the development server**:
   ```bash
   npm run backend
   ```

   The server will start on port 5000 (or the port specified in `PORT` environment variable) and watch for file changes.

### Running with Docker

You can also run the backend using Docker for a more consistent and isolated environment.

#### 1. Build the Image
```bash
docker build -t boundry-backend .
```

#### 2. Run the Container
Since the backend requires several environment variables, the easiest way to run it is by passing your `.env` file:

```bash
docker run -p 5000:5000 --env-file .env boundry-backend
```

**What this command does:**
- `-p 5000:5000`: Maps port 5000 on your machine to port 5000 in the container.
- `--env-file .env`: Injects all variables from your local `.env` file into the container.

Alternatively, you can pass variables individually:
```bash
docker run -p 5000:5000 -e MONGO_URI="your_uri" -e NODE_ENV="production" boundry-backend
```

### Running with Docker Compose

Docker Compose simplifies the process of running your containers. Since the image is now hosted on Docker Hub, you don't even need the source code to run the backend—just the `docker-compose.yml` and your `.env` file.

#### 1. Start the Backend
```bash
docker-compose up
```

**What this command does:**
- Automatically pulls the latest image from `razaaziz/boundry-backend` on Docker Hub (if not already local).
- Handles port mapping and environment variables (via your `.env` file).

#### 2. Stop the Backend
```bash
docker-compose down
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/boundry  # Or your MongoDB Atlas connection string

# JWT
JWT_ACCESS_KEY=your_jwt_secret_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Environment
NODE_ENV=development  # or production
PORT=5000  # Optional, defaults to 5000
```

### API Keys to Consider

- **MongoDB URI**: Obtain from MongoDB Atlas or local MongoDB setup.
- **JWT Secret**: Generate a strong, random secret key for JWT token signing.
- **Cloudinary Credentials**: Sign up at Cloudinary and get your cloud name, API key, and secret from the dashboard.

## Usage

Once the server is running, the API endpoints are available at `http://localhost:5000/api/`.

### Key API Endpoints

- **Authentication**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/profile` - Get current user profile
  - `POST /api/auth/logout` - User logout

- **Listings**:
  - `GET /api/listings` - Get all public listings
  - `POST /api/listings` - Create a new listing (authenticated)
  - `GET /api/listings/my-listings` - Get user's listings (authenticated)
  - `GET /api/listings/:id` - Get specific listing
  - `PATCH /api/listings/:id` - Update listing (owner only)
  - `DELETE /api/listings/:id` - Delete listing (owner only)

- **Users**:
  - `GET /api/users/profile` - Get current user profile (authenticated)
  - `PATCH /api/users/profile` - Update user profile (authenticated)
  - `GET /api/users/:id` - Get public user profile

- **Admin**:
  - `GET /api/admin/listings/pending` - Get pending listings (admin only)
  - `PATCH /api/admin/listings/:id/approve` - Approve listing (admin only)
  - `PATCH /api/admin/listings/:id/reject` - Reject listing (admin only)
  - `GET /api/admin/users` - Get all users (admin only)

For detailed API documentation, refer to the route files and controllers.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.