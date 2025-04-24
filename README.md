# Fermentation Station 🧫

A mobile app for tracking, managing, and monitoring your fermentation projects.

## Overview

Fermentation Station is a comprehensive tool for home fermenters to track all their projects in one place. Whether you're brewing kombucha, fermenting kimchi, or nurturing sourdough, this app helps you monitor progress, set reminders, and keep detailed records of your fermentation journey.

## Features

- **Track multiple fermentation projects** with different statuses (planned, unstable, stable, expired, bad)
- **Log ingredients and process details** for each ferment
- **Set and manage reminders** for feeding, burping, or other maintenance tasks
- **Monitor key metrics** like pH and temperature over time
- **Filter ferments** by status to easily find what needs attention
- **Dark and light mode support** for comfortable viewing in any environment

## Technical Details

This is a cross-platform mobile application built with:

- [React Native](https://reactnative.dev/) and [Expo](https://expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- [React Context API](https://reactjs.org/docs/context.html) for state management
- Modular component architecture for maintainability and reusability

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) app on your physical device

## Project Structure

- `app/` - Main application code using file-based routing
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks including data management
- `constants/` - Type definitions and application constants
- `assets/` - Static assets like images and fonts

## Future Enhancements

- Data persistence using AsyncStorage or a local database
- Image capture for visual tracking of fermentation progress
- Data visualization for temperature and pH trends
- Sharing and exporting recipes
- Community features for comparing notes with other fermenters

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.