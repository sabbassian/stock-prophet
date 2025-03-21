# Stock Prophet - Git and Netlify Deployment Guide

This guide will walk you through the process of setting up a Git repository for Stock Prophet and deploying it to Netlify.

## Setting Up Git Repository

### Option 1: Using the Initialization Script

The easiest way to set up Git is to use the provided `init-git.bat` script:

1. Double-click the `init-git.bat` file in the root of the project.
2. Follow the prompts to initialize the repository, commit your changes, and push to GitHub.
3. The script will handle the setup process for you, including creating a repository on GitHub.

### Option 2: Manual Setup

If you prefer to set up Git manually:

1. Make sure Git is installed on your computer. If not, download and install it from [git-scm.com](https://git-scm.com/).

2. Open a command prompt or terminal and navigate to your project directory:
   ```
   cd path/to/stock-prediction-app
   ```

3. Initialize a Git repository (if you haven't already):
   ```
   git init
   ```

4. Add all files to the staging area:
   ```
   git add .
   ```

5. Commit the changes:
   ```
   git commit -m "Initial commit"
   ```

6. Create a new repository on GitHub:
   - Go to [github.com](https://github.com/) and log in
   - Click on the "+" icon in the top right and select "New repository"
   - Name your repository (e.g., "stock-prophet")
   - Keep it public or private as per your preference
   - Do not initialize with README, .gitignore, or license as we're importing an existing repository
   - Click "Create repository"

7. Link your local repository to the GitHub repository (replace `YOUR_USERNAME` with your actual GitHub username):
   ```
   git remote add origin https://github.com/YOUR_USERNAME/stock-prophet.git
   ```

8. Push your code to GitHub:
   ```
   git push -u origin main
   ```
   Note: If your default branch is named "master" instead of "main", use that instead.

## Deploying to Netlify

### Option 1: Deploy directly from GitHub (Recommended)

1. Go to [netlify.com](https://www.netlify.com/) and sign up or log in (you can use your GitHub account).

2. Click on "New site from Git" button.

3. Select "GitHub" as your Git provider.

4. Authorize Netlify to access your GitHub repositories if prompted.

5. Select the repository you just created (e.g., "stock-prophet").

6. Configure your build settings (these should already be set in the netlify.toml file):
   - Build command: `npm run build`
   - Publish directory: `.next`

7. Click "Deploy site".

8. Wait for the initial build to complete. Netlify will provide you with a unique URL for your site.

9. (Optional) Set up a custom domain:
   - Go to "Site settings" > "Domain management"
   - Click "Add custom domain" and follow the instructions

### Option 2: Manual deploy

If you prefer not to connect your GitHub repository, you can also deploy manually:

1. Build your project locally using the provided script:
   ```
   build-for-netlify.bat
   ```
   Or manually:
   ```
   npm run build
   ```

2. Go to [netlify.com](https://www.netlify.com/) and sign up or log in.

3. Click "Add new site" > "Deploy manually"

4. Drag-and-drop the `.next` folder onto the designated area.

5. Netlify will deploy your site and provide you with a unique URL.

## Continuous Deployment

Once you've connected your GitHub repository to Netlify, any changes you push to your repository will automatically trigger a new build and deployment on Netlify.

To update your site:

1. Make changes to your code locally
2. Commit the changes:
   ```
   git add .
   git commit -m "Describe your changes"
   ```
3. Push to GitHub:
   ```
   git push
   ```

Netlify will automatically detect the changes and redeploy your site.

## Important Notes

- Make sure all your API keys and sensitive information are stored in environment variables and not in your code.
- The repository already includes a `.gitignore` file to prevent sensitive or unnecessary files from being committed.
- The mock data included in the app may not be suitable for production use. In a real-world scenario, you would use actual API calls to fetch live data.

## Troubleshooting

If you encounter any issues with the deployment:

1. Check the build logs on Netlify for specific errors
2. Verify that your `next.config.js` file is properly configured for Netlify deployment
3. Ensure that the `netlify.toml` file is in the root of your project
4. Make sure the `@netlify/plugin-nextjs` plugin is enabled in your Netlify site settings
5. If you see errors related to dependencies, try clearing the Netlify cache and redeploying 