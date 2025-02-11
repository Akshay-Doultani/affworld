Project Overview
    This project is a full-stack web application that includes user authentication, task management, and a feed section for posts. Below is a detailed description of its features and functionalities.

Features
    Responsive Design:
        The website is fully responsive, providing an optimized experience on all devices, thanks to Tailwind CSS.


Authentication:
    Login Page: Allows existing users to log in.
    Register Page: Enables new users to sign up.
    Reset Password: Users can reset their password via OTP verification. OTP emails are sent using Google Console and NodeMailer.

Feed Section:
    After successful login, users are redirected to the feed section.
    Feed: Displays all posts from all users, including the image, caption, and the name of the user who posted it.
    Navigation: A button on the top left corner navigates to the profile page.

Profile Page:
    User-Specific Posts: Displays posts created by the authenticated user.
    Post Actions:
    Edit: Opens the create page with prefilled caption and image fields using the useParams hook.
    Delete: Allows users to delete their posts.
    Create Post: A button below the post section lets users create new posts with a caption and image.
    Cloudinary: Used for image uploads.
    No Posts Message: If no posts exist, a message is displayed: "No posts till now."

Task Management Page:
    Create Task: Users can create tasks with a title and description.
    Task Columns:
    Pending: Newly created tasks appear in this column.
    Completed: Tasks can be moved to this column.
    Task Actions:
    Move Tasks: Drag-and-drop functionality (using react-beautiful-dnd) allows tasks to be moved between columns.
    Mark as Completed: Clicking a checkmark button moves a task from the pending column to the completed column.
    Delete Task: A delete button prompts a confirmation alert before permanently deleting a task.

Navigation:
    Task Page: Accessible via a "Go to Task" button on the top left corner of the profile page.
    Feed Page: A middle button navigates back to the feed page.
    Logout: A button on the top right corner logs out the user.

Navigation Middleware:
    Prevents users from accessing restricted pages if not authenticated.
    Ensures that the user cannot bypass authentication using browser navigation (back/forward buttons).

Tech Stack
    Frontend:
        React.js: For building the user interface.
        Tailwind CSS: For styling.
        React Beautiful DnD: For drag-and-drop functionality.
    Backend:
        Express.js: For handling server-side logic.
        MongoDB Atlas: For the database.
        Node.js: As the runtime environment.
    Libraries:
        Bcrypt: For password hashing.
        NodeMailer: For sending OTP emails.
        Crypto: For secure token generation.

Deployment
    Frontend:
        Hosted on Vercel.
    Backend:
        Deployed on Render.
        Important Note about Render:

Render is a cloud platform that hosts the backend. The free tier of Render may experience a cold start when it’s accessed for the first time after being idle for a while. This means that when you first make a request to the backend, it may take a minute or two for the server to start up properly.
Please be patient when accessing the backend for the first time. Subsequent requests should be much faster as Render keeps the server running after the initial startup.
How to Run


Live Demo:
    https://affworld-theta.vercel.app/
    
Local Setup:
Clone the repository.

Navigate to the project directory.
    https://github.com/Akshay-Doultani/affworld

Run the following commands:

    Frontend: npm run dev
    Backend: npm run dev
    Note: .env files are hidden for security purposes.

Prerequisites
Ensure you have the following installed:

Node.js
MongoDB
NPM or Yarn
Conclusion
This project combines modern technologies and user-friendly design to provide a seamless experience for managing posts and tasks. 
It is an excellent demonstration of MERN stack capabilities with robust authentication and dynamic features.
