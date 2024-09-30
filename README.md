
# My Portfolio

This is a Node.js, Express.js, and TypeScript-based web application. You can either run it locally by installing Node.js or use Docker to quickly set up the app without worrying about dependencies.

## Prerequisites

Before you can run the application, make sure you have the following installed on your system:

- [Docker](https://www.docker.com/products/docker-desktop) (if using Docker)
- [Node.js](https://nodejs.org/en/) (if running locally without Docker)
- [PostgreSQL](https://www.postgresql.org/download/) (for the database)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/your-app.git
cd your-app
```

### Database Setup

1. **Install PostgreSQL**: If you don't already have PostgreSQL installed, follow the instructions [here](https://www.postgresql.org/download/).

2. **Create a Database**:

    Once PostgreSQL is installed, you can create a new database by running the following commands:

    ```bash
    psql -U postgres
    CREATE DATABASE your_database_name;
    ```

3. **Create a User and Grant Permissions**:

    Create a new PostgreSQL user and assign them to the database:

    ```bash
    CREATE USER your_username WITH PASSWORD 'your_password';
    GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
    ```

4. **Set Up the `.env` File**:

    In the project directory, create a `.env` file with the following format:

    ```bash
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASS=your_password
    DB_NAME=your_database_name
    DB_PORT=5432
    DB_SSL=false
    PORT=8080  # Or whichever port your app should run on
    SECRET_KEY=your_secret_key
    ADMIN_PASS=your_desired_admin_account_password
    ```

### Option 1: Running the App with Docker

1. **Build the Docker Image**:

    ```bash
    docker build -t my-portfolio .
    ```

2. **Run the Docker Container with Environment Variables**:

    You can pass the environment variables to the Docker container by using the `--env-file` option:

    ```bash
    docker run --env-file .env -p 8080:8080 my-portfolio
    ```

3. **Access the Web App**:

    Open your browser and go to `http://localhost:8080`.

### Option 2: Running the App Locally (Without Docker)

1. **Install Node.js**: If you don't already have Node.js installed, follow the instructions [here](https://nodejs.org/en/download/).

2. **Install Dependencies**:

    In the project directory, run:

    ```bash
    npm install
    ```

3. **Run the Application**:

    ```bash
    npm run start-app
    ```

4. **Access the Web App**:

    Open your browser and go to `http://localhost:8080`.

## File Uploads

The application has a directory `/uploads` to handle file uploads. This directory is automatically created during the Docker build or when running the app locally.

## Admin section

Once you are running the app in your browser, press the key symbol at the bottom of the page and log in with username 'admin' and the password you set under ADMIN_PASS in the env file.

You can now upload your own presentation, projects and skills to the portfolio.

