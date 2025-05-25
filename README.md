# I believe in good moves

A script to break the habit of speed blitzing your chess moves in long games and forcing you to look at the board for longer

---

## Setup

1. **Open a game** on Chess.com (live or vs. computer)
2. **Open your browser console**  
   - Chrome/Edge: `Ctrl + Shift + J` (Win/Linux) or `⌥ + ⌘ + J` (Mac)  
   - Firefox: `Ctrl + Shift + K` (Win/Linux) or `⌥ + ⌘ + K` (Mac)

3. **Paste the entire script** (from `main.js`) into the console and hit **Enter**
   The UI panel will appear in the top-left corner of the page

---

## How to Use

1. **Configure options** in the floating panel:
   - **Playing vs Bot?** toggle if you're playing a computer
   - **Your color:** select White or Black
   - **Think time (sec):** number of seconds to block after your opponent's move

2. **Starting the observer**  
   After your opponent has just made a move, click **Start Observer**
   - The board will be overlaid with a semi-transparent block and a countdown

3. **Stopping the observer**  
   Click **Stop Observer** at any time to remove the blocker and disconnect the mutation watcher

---

## How It Works

- **MutationObserver** watches the board's DOM for your opponent's move
- When it sees a new piece added (or moved) in the opponent's color, it:
  1. Enters "blocking" state
  2. Displays an overlay + countdown for your configured seconds
  3. Removes the block and returns to "waiting for your move"

---

## Demonstration

https://github.com/user-attachments/assets/63b1b684-1577-4250-b70d-7eaf9257449e

---

> **Note:** This is intended for training/visualization only. Use responsibly and in accordance with Chess.com’s terms of service




