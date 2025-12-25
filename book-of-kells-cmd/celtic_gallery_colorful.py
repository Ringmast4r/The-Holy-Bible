#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Celtic Gallery - Colorful Terminal Version
Preserves all original ANSI color codes from the ASCII art
No TUI framework - just pure terminal colors!
"""

import os
import sys

# Add COA-CMD-Tool to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'COA-CMD-Tool'))

try:
    from coat_of_arms_art_real import SHAMROCK, CELTIC_CROSS_SMALL, CELTIC_CROSS, RED_HAND_ART, RED, GREEN, RESET
except ImportError:
    print("Error: Cannot find COA-CMD-Tool directory!")
    sys.exit(1)

# ANSI Color codes for our own decorations
GOLD = '\033[93m'
CYAN = '\033[96m'
MAGENTA = '\033[95m'
YELLOW = '\033[93m'
BRIGHT_GREEN = '\033[92m'
BRIGHT_RED = '\033[91m'
DIM = '\033[2m'
BOLD = '\033[1m'
RESET = '\033[0m'

# Celtic art from Book of Kells
CELTIC_CROSS_JGS = BRIGHT_GREEN + """
              _..._
            .-|>X<|-.
          _//.|oxo|.\\_
         /xo=._\\X/_.=ox\\
         |<>X<>(_)<>X<>|
         \\xo.='/X\\'=.ox/
           \\_/oxo\\_//
            ';<>X<>;'
             |=====|
             |<>X<>|
             |oxoxo|
             |<>X<>|
            _|oxoxo|_
       jgs.--' ===== '--.
""" + RESET

CELTIC_KNOT_PATTERN_1 = CYAN + """
        /\\  /\\
       /  \\/  \\
      / /\\ \\/\\ \\
      \\ \\/\\ \\/ /
       \\/ /\\/ /
       / /\\/ /\\
      / /\\  /\\ \\
     / /  \\/  \\ \\
     \\ \\  /\\  / /
      \\ \\/  \\/ /
       \\/ /\\/ /
       / /\\/ /\\
      / /\\ \\/\\ \\
      \\ \\/\\ \\/ /
       \\  /\\  /
        \\/  \\/
""" + RESET

CELTIC_KNOT_PATTERN_2 = MAGENTA + """
         /\\    /\\
        /  \\  /  \\
       / /\\ \\/ /\\ \\
      / /  \\ \\/  \\ \\
     / /   /\\ \\   \\ \\
     \\ \\  / /\\ \\  / /
      \\ \\/ /  \\ \\/ /
       \\/ /    \\/ /
       / /\\    / /\\
      / /\\ \\  / /\\ \\
     / /  \\ \\/ /  \\ \\
     \\ \\   \\ \\/   / /
      \\ \\  /\\ \\  / /
       \\ \\/ /\\ \\/ /
        \\  /  \\  /
         \\/    \\/
""" + RESET

ELABORATE_CROSS = YELLOW + """
                 .-------.
                 |(~\\o/~)|
               _.||/\\X/\\||._
            ,-"  || \\ / ||  "-,
          ,'  () ||o X o|| ()  ',
         / ()  ,-|| / \\ ||-,  () \\
        : o  ,'  ||/\\X/\\||  ',  o ;
     .----------._)~   ~(_.----------.
     |\\/)~~(\\/\\   (~\\ /~)   /\\/)~~(\\/|
     |(X () X) >o  >-X-<  o< (X () X)|
     |/\\)__(/\\/  _(_/|\\_)_  \\/\\)__(/\\|
     '----------' )     ( '----------'
        ; o  ',  ||/\\~/\\/||  ,'  o ;
         \\ ()  '-|| \\o/ ||-'  () /
          ',  () |(~\\ /~)| ()  ,'
            '-._ ||/\\X/\\|| _.-'
                '|| \\ / ||'
                 ||  X  ||
                 ||\\(/\\/||
                 ||=)O(=||
                 ||/\\/)||
                 ||  X  ||
                 || / \\ ||
                 ||/\\X/\\||
           jgs   |(_/o\\_)|
                 '._____.'
""" + RESET

LARGE_CELTIC_KNOT = CYAN + """
              /\\/\\
             /  \\ \\
            / /\\ \\ \\
            \\/ /\\/ /
            / /\\/ /\\
           / /\\ \\/\\ \\
          / / /\\ \\ \\ \\
       /\\/ / / /\\ \\ \\ \\/\\
      /  \\/ / /  \\ \\ \\ \\ \\
     / /\\ \\/ /    \\ \\/\\ \\ \\
     \\/ /\\/ /      \\/ /\\/ /
     / /\\/ /\\      / /\\/ /\\
     \\ \\ \\/\\ \\    / /\\ \\/ /
      \\ \\ \\ \\ \\  / / /\\  /
       \\/\\ \\ \\ \\/ / / /\\/
          \\ \\ \\ \\/ / /
           \\ \\/\\ \\/ /
            \\/ /\\/ /
            / /\\/ /\\
            \\ \\ \\/ /
             \\ \\  /
              \\/\\/
""" + RESET

MASSIVE_WEAVE = MAGENTA + """
                       /\\  /\\
                      /  \\/  \\
                     / /\\/ /\\ \\
                     \\ \\/ /\\/ /
                      \\ \\/\\ \\/
                      /\\ \\/\\ \\
                     / /\\/ /\\ \\
                    / / / /\\ \\ \\
               /\\  / / / /\\ \\ \\ \\  /\\
              /  \\/ / / /  \\ \\ \\ \\/  \\
             / /\\/ / / /    \\ \\ \\/ /\\ \\
             \\ \\/ /\\/ /      \\ \\/ /\\/ /
              \\ \\/\\ \\/ /\\  /\\ \\ \\/\\ \\/
              /\\ \\/\\ \\/  \\/  \\/\\ \\/\\ \\
             / /\\/ /\\/ /\\/ /\\/ /\\/ /\\ \\
            / / / /\\/ /\\/ /\\/ /\\/ /\\ \\ \\
       /\\  / / / /\\ \\/\\ \\/\\ \\/\\ \\/\\ \\ \\ \\  /\\
      /  \\/ / / / /\\ \\/\\ \\/\\ \\/\\ \\ \\ \\ \\ \\/  \\
     / /\\/ / / / / /\\/ /\\/ /\\/ /\\ \\ \\ \\ \\/ /\\ \\
     \\ \\/ /\\/ / / / / /\\/ /\\/ /\\ \\ \\ \\ \\/ /\\/ /
      \\ \\/\\ \\/ / / / /\\ \\/\\ \\/\\ \\ \\ \\ \\ \\/\\ \\/
      /\\ \\/\\ \\ \\ \\ \\ \\/\\ \\/\\ \\/ / / / /\\ \\/\\ \\
     / /\\/ /\\ \\ \\ \\ \\/ /\\/ /\\/ / / / / /\\/ /\\ \\
     \\ \\/ /\\ \\ \\ \\ \\/ /\\/ /\\/ /\\/ / / / / /\\/ /
      \\  /\\ \\ \\ \\ \\ \\/\\ \\/\\ \\/\\ \\/ / / / /\\  /
       \\/  \\ \\ \\ \\/\\ \\/\\ \\/\\ \\/\\ \\/ / / /  \\/
            \\ \\ \\/ /\\/ /\\/ /\\/ /\\/ / / /
             \\ \\/ /\\/ /\\/ /\\/ /\\/ /\\/ /
              \\ \\/\\ \\/\\  /\\  /\\ \\/\\ \\/
              /\\ \\/\\ \\ \\/  \\/ /\\ \\/\\ \\
             / /\\/ /\\ \\      / /\\/ /\\ \\
             \\ \\/ /\\ \\ \\    / / / /\\/ /
              \\  /\\ \\ \\ \\  / / / /\\  /
               \\/  \\ \\ \\ \\/ / / /  \\/
                    \\ \\ \\/ / / /
                     \\ \\/ /\\/ /
                      \\ \\/\\ \\/
                      /\\ \\/\\ \\
                     / /\\/ /\\ \\
                     \\ \\/ /\\/ /
                      \\  /\\  /
                       \\/  \\/
""" + RESET

CELTIC_BORDER_PATTERN = GREEN + """
      .--..--..--..--.
     / .. \\.. \\.. \\.. \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ `'\\ `'\\ `'\\ `' /
      `--'`--'`--'`--'
""" + RESET

# Psalm 84 data structures
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


def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header(title):
    """Print a fancy header"""
    print(f"\n{GOLD}{'=' * 80}{RESET}")
    print(f"{GOLD}  {title}{RESET}")
    print(f"{GOLD}{'=' * 80}{RESET}\n")


def print_menu():
    """Print the main menu"""
    clear_screen()
    print(f"""
{BOLD}{GOLD}╔═══════════════════════════════════════════════════════════════════╗{RESET}
{BOLD}{GOLD}║ ※ ◊ ※ ◊ ※     CELTIC ART GALLERY - COLORFUL     ◊ ※ ◊ ※ ◊ ※     ║{RESET}
{BOLD}{GOLD}║         Preserving Original ANSI Colors & ASCII Art              ║{RESET}
{BOLD}{GOLD}╚═══════════════════════════════════════════════════════════════════╝{RESET}

{CYAN}Select an option to view colorful Celtic art:{RESET}

  {GOLD}1{RESET} - {BRIGHT_GREEN}Irish Shamrock{RESET} (Green, from COA-CMD-Tool)
  {GOLD}2{RESET} - {BRIGHT_GREEN}Celtic Cross Small{RESET} (Green, from COA-CMD-Tool)
  {GOLD}3{RESET} - {BRIGHT_GREEN}Celtic Cross Large{RESET} (Green, detailed, from COA-CMD-Tool)
  {GOLD}4{RESET} - {BRIGHT_GREEN}Celtic Cross JGS{RESET} (Green, by Joan Stark)
  {GOLD}5{RESET} - {CYAN}Celtic Knot Pattern 1{RESET} (Cyan, interlaced)
  {GOLD}6{RESET} - {MAGENTA}Celtic Knot Pattern 2{RESET} (Magenta, extended weave)
  {GOLD}7{RESET} - {YELLOW}Elaborate Cross{RESET} (Yellow, ornate)
  {GOLD}8{RESET} - {BRIGHT_RED}Red Hand of Ulster{RESET} (Red/Multi-color, Irish symbol)

  {GOLD}Q{RESET} - {BRIGHT_RED}Exit{RESET}

{DIM}※ All ANSI colors preserved! ※{RESET}
""")


def show_shamrock():
    """Display the Irish Shamrock"""
    clear_screen()
    print_header("IRISH SHAMROCK - Symbol of Ireland")
    print(SHAMROCK)
    print(f"\n{CYAN}The shamrock (seamróg) is the traditional symbol of Ireland.{RESET}")
    print(f"{CYAN}Saint Patrick used it to explain the Holy Trinity.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_celtic_cross_small():
    """Display the small Celtic cross"""
    clear_screen()
    print_header("CELTIC CROSS - Compact Version")
    print(CELTIC_CROSS_SMALL)
    print(f"\n{CYAN}A traditional Irish Celtic cross combining Christian and Celtic symbolism.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_celtic_cross_large():
    """Display the large Celtic cross"""
    clear_screen()
    print_header("CELTIC CROSS - Detailed Large Version")
    print(CELTIC_CROSS)
    print(f"\n{CYAN}An elaborate Celtic cross with intricate knotwork patterns.{RESET}")
    print(f"{CYAN}The circle represents eternity, the cross represents faith.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_celtic_cross_jgs():
    """Display Joan Stark's Celtic cross"""
    clear_screen()
    print_header("CELTIC CROSS - by Joan Stark (jgs)")
    print(CELTIC_CROSS_JGS)
    print(f"\n{CYAN}Classic Celtic cross ASCII art by renowned artist Joan Stark.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_knot_1():
    """Display Celtic knot pattern 1"""
    clear_screen()
    print_header("CELTIC KNOT PATTERN 1 - Basic Interlaced")
    print(CELTIC_KNOT_PATTERN_1)
    print(f"\n{CYAN}Traditional Celtic knotwork representing eternal life and interconnectedness.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_knot_2():
    """Display Celtic knot pattern 2"""
    clear_screen()
    print_header("CELTIC KNOT PATTERN 2 - Extended Weave")
    print(CELTIC_KNOT_PATTERN_2)
    print(f"\n{CYAN}More complex Celtic weave pattern showing the endless cycle.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_elaborate_cross():
    """Display elaborate cross"""
    clear_screen()
    print_header("ELABORATE CELTIC CROSS - Ornate Design")
    print(ELABORATE_CROSS)
    print(f"\n{CYAN}Highly detailed Celtic cross with ornamental flourishes.{RESET}")
    print(f"{CYAN}Created by Joan Stark (jgs){RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def show_red_hand():
    """Display Red Hand of Ulster"""
    clear_screen()
    print_header("RED HAND OF ULSTER - Ancient Irish Symbol")
    print(RED_HAND_ART)
    print(f"\n{CYAN}The Red Hand of Ulster - an ancient symbol used by many Irish families.{RESET}")
    print(f"{CYAN}Associated with the province of Ulster and numerous Irish clans.{RESET}")
    input(f"\n{DIM}Press Enter to return to menu...{RESET}")


def main():
    """Main program loop"""
    while True:
        print_menu()
        choice = input(f"{GOLD}Enter your choice: {RESET}").strip().upper()

        if choice == '1':
            show_shamrock()
        elif choice == '2':
            show_celtic_cross_small()
        elif choice == '3':
            show_celtic_cross_large()
        elif choice == '4':
            show_celtic_cross_jgs()
        elif choice == '5':
            show_knot_1()
        elif choice == '6':
            show_knot_2()
        elif choice == '7':
            show_elaborate_cross()
        elif choice == '8':
            show_red_hand()
        elif choice == 'Q':
            clear_screen()
            print(f"\n{GOLD}※ Go raibh maith agat (Thank you) ※{RESET}")
            print(f"{CYAN}May the Celtic spirits bless your path!{RESET}\n")
            break
        else:
            print(f"\n{BRIGHT_RED}Invalid choice! Please try again.{RESET}")
            input(f"{DIM}Press Enter to continue...{RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        clear_screen()
        print(f"\n{GOLD}※ Go raibh maith agat (Thank you) ※{RESET}\n")
