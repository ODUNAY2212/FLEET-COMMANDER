# Fleet Commander

Fleet Commander is a lightweight browser-based logistics tracker for managing a fleet of vehicles.

## Overview

This project provides a simple operations registry for vehicle status tracking, including:

- Registering vehicles with model name, mileage, and status
- Displaying vehicles in categories: Active, Maintenance, and Standby
- Removing individual vehicles
- Purging all vehicles currently under maintenance
- Calculating the total distance across the fleet

## Files

- `index.html` - application UI structure
- `style.css` - visual styling
- `script.js` - fleet management logic and interaction handling

## Features

- Add a vehicle with model, mileage, and current status
- Form validation for required fields and mileage input
- Dynamic rendering of fleet cards grouped by status
- Total mileage summary for all registered vehicles
- Remove individual fleet entries
- Purge all vehicles marked as Maintenance

## How to Run

1. Open `index.html` in a modern web browser.
2. Enter a vehicle model and mileage.
3. Choose a status and click `Register`.
4. Use the displayed cards and buttons to manage the fleet.

## Notes

- The app runs entirely in the browser and requires no build steps or external dependencies.
- Data is stored only in memory, so page refreshes will reset the fleet list.
