#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Psalm 84 - Colorful Terminal Display
With Celtic knot borders - exactly matching the image!
Pure ANSI colors, no TUI framework
"""

import os

# ANSI Color codes
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'

# Celtic knot border patterns (8-line repeating cycle)
CELTIC_BORDER_LEFT = [
    "   / \\  / \\",
    "  /  \\/  \\",
    " / /\\ \\/\\ \\",
    " \\ \\/\\ \\/ /",
    "  \\/ /\\/ /",
    "  / /\\/ /\\",
    " / /\\  /\\ \\",
    "/ /  \\/  \\ \\",
]

CELTIC_BORDER_RIGHT = [
    "/ \\  / \\",
    " \\  /\\  /",
    " \\ \\/ \\/ /",
    "  \\/ /\\/ ",
    "  / /\\/ /\\",
    " / /\\ \\/\\ \\",
    "/ /  \\/  \\ \\",
    "\\ \\  /\\  / /",
]

# Psalm 84 text (plain version for each line)
PSALM_LINES = [
    ("                                                                  ", "Psalm 84"),
    ("", ""),
    ("", ""),
    ("    How amiable are thy tabernacles,", ""),
    ("                         ", "O", " LORD of hosts!"),
    ("", ""),
    ("    My soul longeth, yea, even fainteth for", ""),
    ("  the courts of the LORD: my heart and my", ""),
    ("   flesh crieth out for the living God.", ""),
    ("", ""),
    ("    Yea, the sparrow hath found an house, and", ""),
    ("  the swallow a nest for herself, where she", ""),
    ("   may lay her young, even thine altars, ", "O", ""),
    ("    LORD of hosts, my King, and my God.", ""),
    ("", ""),
    ("  ", "B", "lessed are they that dwell in thy house:"),
    ("   they will be still praising thee. Selah.", ""),
    ("", ""),
    ("", "B", "lessed is the man whose strength is in thee; in whose heart are the"),
    ("ways of them.", ""),
    ("", ""),
    ("Who passing through the valley of Baca make it a well; the rain", ""),
    ("also filleth the pools.", ""),
    ("", ""),
    ("They go from strength to strength, every one of them in Zion", ""),
    ("appeareth before God.", ""),
    ("", ""),
    ("", "O", " LORD God of hosts, hear my prayer: give ear, ", "O", " God of Jacob. Selah."),
    ("", ""),
    ("Behold, ", "O", " God our shield, and look upon the face of thine annointed."),
    ("", ""),
    ("For a day in thy courts is better than a thousand. I had rather be a", ""),
    ("doorkeeper in the house of my God, than to dwell in the tents of", ""),
    ("wickedness.", ""),
    ("", ""),
    ("For the LORD God is a sun and shield: the LORD will give grace and", ""),
    ("glory: no good thing will he withold from them that walk uprightly.", ""),
    ("", ""),
    ("", "O", " LORD of hosts, blessed is the man that trusteth in thee."),
]


def format_psalm_line(line_data):
    """Format a psalm line with proper yellow and red colors"""
    if len(line_data) == 2:
        # Simple line: (text, "")
        if line_data[1] == "Psalm 84":
            # Special case: title line
            return YELLOW + line_data[0] + RED + line_data[1] + RESET
        else:
            # Normal line
            return YELLOW + line_data[0] + RESET
    elif len(line_data) == 3:
        # Line with one red letter: (before, "O" or "B", after)
        return YELLOW + line_data[0] + RED + line_data[1] + YELLOW + line_data[2] + RESET
    elif len(line_data) == 5:
        # Line with two red letters: (before, "O", middle, "O", after)
        return YELLOW + line_data[0] + RED + line_data[1] + YELLOW + line_data[2] + RED + line_data[3] + YELLOW + line_data[4] + RESET
    else:
        return ""


def display_psalm():
    """Display Psalm 84 with Celtic borders"""
    os.system('cls' if os.name == 'nt' else 'clear')

    print()
    # Top border
    print("     /" + "-" * 75 + "\\")

    # Each line with borders
    for i, line_data in enumerate(PSALM_LINES):
        # Get border patterns (cycling)
        left_idx = i % len(CELTIC_BORDER_LEFT)
        right_idx = i % len(CELTIC_BORDER_RIGHT)

        left_border = CELTIC_BORDER_LEFT[left_idx]
        right_border = CELTIC_BORDER_RIGHT[right_idx]

        # Format the psalm line with colors
        psalm_text = format_psalm_line(line_data)

        # Calculate plain text length for padding
        if len(line_data) == 2:
            plain_length = len(line_data[0]) + len(line_data[1])
        elif len(line_data) == 3:
            plain_length = len(line_data[0]) + len(line_data[1]) + len(line_data[2])
        elif len(line_data) == 5:
            plain_length = len(line_data[0]) + len(line_data[1]) + len(line_data[2]) + len(line_data[3]) + len(line_data[4])
        else:
            plain_length = 0

        padding = 65 - plain_length

        # Print: [green]left_border[/green] + psalm_text + padding + [green]right_border[/green]
        print(f"{GREEN}{left_border}{RESET}  {psalm_text}{' ' * padding}  {GREEN}{right_border}{RESET}")

    # Bottom border
    print("     \\" + "-" * 75 + "/")
    print()


def main():
    """Main function"""
    display_psalm()
    print(f"{YELLOW}※ Press any key to exit ※{RESET}")
    input()


if __name__ == "__main__":
    main()
