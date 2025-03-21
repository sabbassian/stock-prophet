# Running the Stock Prophet Application

## Option 1: Using the HTML Launcher (Recommended)

1. Simply double-click the `launch.bat` file in the stock-prediction-app folder.
2. This will open the launcher in your default web browser and start the server.
3. Click the "Launch Application" button in the browser interface or use "Open in Browser" if the server is already running.

## Option 2: Using the Desktop Shortcut

### Method A (Primary):
1. Run the `create-shortcut.bat` file by double-clicking it. This will create a "Stock Prophet" shortcut on your desktop.
2. If the shortcut doesn't work, try the alternative method below.

### Method B (Alternative):
1. If Method A doesn't work, run the `create-shortcut-alt.bat` file by double-clicking it.
2. This uses an alternative VBScript method which may work better on some systems.

Once created:
- Double-click the "Stock Prophet" shortcut on your desktop to start the development server.
- Open your browser and navigate to http://localhost:3000 to view the application.

### Troubleshooting Desktop Shortcut Issues:
- If the shortcut doesn't work, right-click it and select "Properties"
- Check that the "Target" field points to the correct location of `start-app.bat` in your project folder
- Make sure the "Start in" field contains the path to your project folder
- Try running either shortcut creation script as administrator (right-click, "Run as administrator")
- If all else fails, use Option 1 or Option 3 to start the app

## Option 3: Manual Start

1. Open a command prompt or PowerShell window.
2. Navigate to the stock-prediction-app directory:
   ```
   cd path\to\stock-prediction-app
   ```
3. Install dependencies (if you haven't already):
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to http://localhost:3000 to view the application.

## Using the Web Launcher

A web-based launcher (index.html) is included in the project folder. This provides a nice interface for starting the application and can be accessed in several ways:

1. By using the `launch.bat` file as described in Option 1
2. By directly opening the `index.html` file in your browser
3. By starting the server using any method and then navigating to http://localhost:3000

The launcher provides buttons to:
- Launch the application (starts the server if possible)
- Open the application in the browser (if the server is already running)

Note: Due to browser security restrictions, the "Launch Application" button may not be able to start the server directly from the browser. If this happens, the launcher will display instructions to manually start the server.

## GitHub and Netlify Deployment

### Setting Up Git Repository
1. Run the `init-git.bat` file by double-clicking it
2. Follow the prompts to:
   - Initialize a Git repository
   - Add and commit your files
   - Link to your GitHub account
   - Push to GitHub (optional)

### Deploying to Netlify
1. Go to [netlify.com](https://www.netlify.com/) and sign up or log in
2. Click "New site from Git" button
3. Select GitHub as your Git provider
4. Choose your repository
5. Netlify will automatically detect the configuration from netlify.toml

For more detailed instructions, see the `GITHUB.md` file in this project.

## Testing the Application

- Navigate through the different sections of the application to ensure all components are rendering correctly.
- Test the search functionality by entering stock symbols or company names.
- Check that the trending stocks section displays proper data and charts.
- Verify that the daily stock picks are displayed correctly.
- Test the responsive design by resizing your browser window.

## Troubleshooting

- If you see module not found errors, make sure you've run `npm install` to install all dependencies.
- If the application is not loading at localhost:3000, check that the development server is running without errors.
- For any other issues, check the console in your browser's developer tools for error messages. 