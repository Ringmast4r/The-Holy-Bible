#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Celtic Gallery - EXPANDED with ALL art from asciiart.eu
Complete collection of Celtic ASCII art with full colors preserved!
"""

import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    import msvcrt
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'replace')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'replace')
else:
    import termios
    import tty

# Add COA-CMD-Tool to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'COA-CMD-Tool'))

try:
    from coat_of_arms_art_real import SHAMROCK, CELTIC_CROSS_SMALL, CELTIC_CROSS, RED_HAND_ART
except ImportError:
    SHAMROCK = "<!-- Shamrock art not found -->"
    CELTIC_CROSS_SMALL = "<!-- Celtic cross art not found -->"
    CELTIC_CROSS = "<!-- Celtic cross art not found -->"
    RED_HAND_ART = "<!-- Red hand art not found -->"

# ANSI Color codes
GOLD = '\033[93m'
CYAN = '\033[96m'
MAGENTA = '\033[95m'
YELLOW = '\033[93m'
BRIGHT_GREEN = '\033[92m'
BRIGHT_RED = '\033[91m'
BRIGHT_BLUE = '\033[94m'
BRIGHT_CYAN = '\033[96m'
BRIGHT_MAGENTA = '\033[95m'
BRIGHT_YELLOW = '\033[93m'
DIM = '\033[2m'
BOLD = '\033[1m'
RESET = '\033[0m'

# ============================================================================
# CELTIC ART from asciiart.eu
# ============================================================================

# Celtic Cross by Joan Stark (jgs)
CELTIC_CROSS_JGS = BRIGHT_GREEN + """
         _..._
       .-|>X<|-.
     _//`|oxo|`\\\\_
    /xo=._\\\\X/_.=ox\\\\
    |<>X<>(_)<>X<>|
    \\\\xo.='/X\\\\'=.ox/
      \\\\_/oxo\\\\_//
       ';<>X<>;'
        |=====|
        |<>X<>|
        |oxoxo|
        |<>X<>|
       _|oxoxo|_
  jgs  '--=====--'
""" + RESET

# Celtic Knot 1 - Basic Interlaced
CELTIC_KNOT_1 = CYAN + """
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

# Celtic Knot 2 - Extended Weave
CELTIC_KNOT_2 = MAGENTA + """
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

# Celtic Border Pattern
CELTIC_BORDER = BRIGHT_GREEN + """
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

# Celtic Knot 3 - Simple Vertical
CELTIC_KNOT_3 = YELLOW + """
    /\\
   /  \\
  / /\\ \\
  \\ \\/ /
   \\  /
    \\/

   /\\  /\\  /\\
  /  \\/  \\/  \\
 / /\\/ /\\/ /\\ \\
/ / / /\\/ /\\ \\ \\
\\ \\ \\/ /\\/ / / /
 \\ \\/ /\\/ /\\/ /
  \\  /\\  /\\  /
   \\/  \\/  \\/
""" + RESET

# Celtic Knot 4 - Compact Diamond
CELTIC_KNOT_4 = BRIGHT_CYAN + """
   /\\/\\
  / /  \\
 / / /\\ \\
 \\ \\/ / /
  \\  / /
   \\/\\/
""" + RESET

# Large Celtic Knot - Massive Pattern
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

# Celtic Knot 5 - Tall Vertical
CELTIC_KNOT_5 = BRIGHT_MAGENTA + """
  /\\
 /  \\
/ /\\ \\
\\ \\/ /
 \\ \\/
 /\\ \\
 \\ \\/
 /\\ \\
 \\ \\/
 /\\ \\
/ /\\ \\
\\ \\ \\/
/\\ \\ \\
\\ \\/ /
 \\ \\/
 /\\ \\
 \\ \\/
 /\\ \\
 \\ \\/
 /\\ \\
/ /\\ \\
\\ \\/ /
 \\  /
  \\/
""" + RESET

# Elaborate Celtic Cross 1 by Joan Stark
ELABORATE_CROSS_1 = YELLOW + r"""
            .-------.
            |(~\o/~)|
          _.||\/X\/||._
       ,-"  || \ / ||  "-,
     ,'  () ||o X o|| ()  ',
    / ()  ,-|| / \ ||-,  () \
   : o  ,'  ||/\X/\||  ',  o ;
.----------._)~   ~(_.----------.
|\/)~~(\/\   (~\ /~)   /\/)~~(\/|
|(X () X) >o  >-X-<  o< (X () X)|
|/\)__(/\/  _(_/|\_)_  \/\)__(/\|
'----------' )     ( '----------'
   ; o  ',  ||\/~\/||  ,'  o ;
    \ ()  '-|| \o/ ||-'  () /
     ',  () |(~\ /~)| ()  ,'
       '-._ ||\/X\/|| _.-'
           '|| \ / ||'
            ||  X  ||
            ||\(/\/||
            ||=)O(=||
            ||/\/)\||
            ||  X  ||
            || / \ ||
            ||/\X/\||
      jgs   |(_/o\_)|
            '._____.'
""" + RESET

# Elaborate Celtic Cross 2 by Joan Stark (variant)
ELABORATE_CROSS_2 = BRIGHT_YELLOW + r"""
            .-------.
            |(~\o/~)|
          _.||\/X\/||._
       ,-"  || \ / ||  "-,
     ,'  () ||o X o|| ()  ',
    / ()  ,-|| / \ ||-,  () \
   : o  ,'  ||/\X/\||  ',  o ;
.----------._).-.-.(_.----------.
|\/)~~(\/\ o (     ) o /\/)~~(\/|
|(X () X)  .-.\ : /.-.  (X () X)|
|/\)__(/\/(   .`:`.   )\/\)__(/\|
'----------(   /|\   )----------'
   ; o  ',  |"` | `"|  ,'  o ;
    \ ()  '-|  /o\  |-'  () /
     ',  () |(~\ /~)| ()  ,'
       '-._ ||\/X\/|| _.-'
           '|| \ / ||'
            ||  X  ||
            ||\(/\/||
            ||=)O(=||
            ||/\/)\||
            ||  X  ||
            || / \ ||
            ||/\X/\||
      jgs   |(_/o\_)|
            '._____.'
""" + RESET

# Celtic Knot 6 - Diamond Weave
CELTIC_KNOT_6 = BRIGHT_GREEN + """
    /\\    /\\
   /  \\  /  \\
  / /\\ \\/ /\\ \\
 / /  \\/ /  \\ \\
/ / /\\ \\/\\/\\ \\ \\
\\ \\ \\/\\/\\ \\/ / /
 \\ \\/ / /\\/ / /
  \\ \\/\\/\\ \\/\\/
  /\\/\\ \\/\\/\\ \\
 / / /\\  / /\\ \\
/ / /\\ \\/ /\\ \\ \\
\\ \\/  \\  /  \\ \\/
/\\ \\   \\/   /\\ \\
\\ \\/        \\ \\/
/\\ \\        /\\ \\
\\ \\/        \\ \\/
/\\ \\        /\\ \\
\\ \\/   /\\   \\ \\/
/\\ \\  /  \\  /\\ \\
\\ \\ \\/ /\\ \\/ / /
 \\ \\/ /  \\/ / /
  \\ \\/\\/\\ \\/\\/
  /\\/\\ \\/\\/\\ \\
 / / /\\/ / /\\ \\
/ / /\\ \\/\\/\\ \\ \\
\\ \\ \\/\\/\\ \\/ / /
 \\ \\  / /\\  / /
  \\ \\/ /\\ \\/ /
   \\  /  \\  /
    \\/    \\/
""" + RESET

# Massive Celtic Weave - HUGE Pattern
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

# Celtic Knot 7 - Flowing Pattern
CELTIC_KNOT_7 = CYAN + """
        /\\  /\\
       /  \\/  \\
       \\ \\ \\/ /
        \\/\\/ /
        / /\\/\\
       / /\\ \\ \\
      / / /\\ \\ \\
     / / /  \\ \\ \\
     \\ \\ \\  / / /
      \\ \\ \\/ / /
       \\ \\ \\/ /
        \\/\\/ /
        / /\\/\\
       / /\\ \\ \\
      / / /\\ \\ \\
     / / /  \\ \\ \\
    / / /    \\ \\ \\
   / / / /\\/\\ \\ \\ \\
  / / / /  \\ \\ \\ \\ \\
 / / / / /\\ \\ \\ \\ \\ \\
 \\ \\ \\ \\/ /\\/ / / / /
  \\ \\ \\/ /\\/ /\\/ / /
   \\ \\ \\/\\ \\/\\ \\/ /
    \\/\\ \\/\\ \\/\\/ /
  /\\/ /\\/ /\\/ / /\\/\\
 /  \\/\\ \\/\\/ /\\/\\ \\ \\
/ /\\ \\/\\ \\ \\/\\ \\/\\ \\ \\
\\/ /\\/ /\\/\\/ /\\/ /\\/ /
/ /\\/ /\\/ /\\/\\/ /\\/ /\\
\\ \\ \\/\\ \\/\\ \\ \\/\\ \\/ /
 \\ \\ \\/\\/ /\\/\\ \\/\\  /
  \\/\\/ / /\\/ /\\/ /\\/
    / /\\/\\ \\/\\ \\/\\
   / /\\ \\/\\ \\/\\ \\ \\
  / / /\\/ /\\/ /\\ \\ \\
 / / / / /\\/ /\\ \\ \\ \\
 \\ \\ \\ \\ \\ \\/ / / / /
  \\ \\ \\ \\ \\  / / / /
   \\ \\ \\ \\/\\/ / / /
    \\ \\ \\    / / /
     \\ \\ \\  / / /
      \\ \\ \\/ / /
       \\ \\ \\/ /
        \\/\\/ /
        / /\\/\\
       / /\\ \\ \\
       \\  /\\  /
        \\/  \\/
""" + RESET

# Map of Ireland - Small (by ScS)
IRELAND_MAP_SMALL = BRIGHT_GREEN + r"""
       _,.
     / ;''''.
  ,__//  .   )
 ;     '' './
 '.,.      \ ScS
   /       |
   /`      |
;''    __,:
;,.''``
""" + RESET

# Map of Ireland - Large (by jorn)
IRELAND_MAP_LARGE = BRIGHT_GREEN + r"""
                    __   __---_
               ,-~~~  ~\/      ~\
             ,_/                 |
            /,_                   /
       _       _/                 ~\
    /~~ ~\/~-_|                    /
   \                            /~
   \ _                       _\/
     ,'                     |
   /~                        \
   \                          |
    '~|__-                    /
     oo ,/~                    \
       |                      /
      /                       |
    /___/~                    |
    /                        /
,--~                         |
/---                   __|_-_/
,-~                 ,-~
\_-~/          \ /~
,-~/=        _/~
--~/_-_-/~'~

-jorn
""" + RESET

# Leprechaun (by jgs)
LEPRECHAUN = BRIGHT_GREEN + r"""
                                      .-----.   ()()
                                     /       \ .'()
                                     |__...__|/
                                     |_....._|
                                   .-'  ___  '-.
                                   \_.-`. .`-._/
             __ .--. _              (|\ (_) /|)
          .-;.-"-.-;`_;-,            ( \_=_/ )
        .(_( `)-;___),-;_),          _(_   _)_
       (.( `\.-._)-.(   ). )       /` ||'-'|| `\
     ,(_`'--;.__\  _).;--'`_)  _  /_/ (_>o<_) \_\
    // )`--..__ ``` _( o )'(';,)\_//| || : || |\\
    \;'        `````  `\\   '.\\--' |`"""""""`|//
    /                   ':.___//     \___,___/\_(
   |                      '---'|      |__|__|
   ;                           ;      ;""|"";
    \                         /       [] | []
     '.                     .'      .'  / \  '.
    jgs'-,.__         __.,-'        `--'   `--'
        (___/`````````\___)
""" + RESET

# ============================================================================
# CELTIC BORDER TUTORIAL - Building Blocks
# ============================================================================

# Basic Celtic Border Configuration
CELTIC_BORDER_BASIC = CYAN + r"""
 .---.--.          .---.                 ,---.
( (/\ \) )        ( ( \ \               / / ) )
 \/ /\/ /   ____   \ \ \ \       |     / / / /
 / /\/ /\   ----    \ \ \ \    --+--  / / / /
( (\ \/) )           \ \ ) )     |   ( ( / /
 `--`---'             `---'           `---'
""" + RESET

# Simple 8-Ring Pattern
CELTIC_BORDER_8RING = MAGENTA + r"""
     .--..--.
    / .. \.. \
    \ \/\ \/ /
     \/ /\/ /
     / /\/ /\
    / /\ \/\ \
    \ `'\ `' /
     `--'`--'
""" + RESET

# With Breaklines (Horizontal & Vertical)
CELTIC_BORDER_BREAKLINES = YELLOW + r"""
     .--..--.     .--..--.
    / .. \.. \   / .. \.. \
    \ \/\ \/ /   | |/\ \/ /
     \/ /\/ /    | || h/ /
     / /`' /\    | || y /\
    / /`--'\ \   | |\ \/\ \
    \ `----' /   \ `'\ `' /
     `------'     `--'`--'

   horizontal     vertical
    breakline     breakline
""" + RESET

# Larger 16-Ring Pattern
CELTIC_BORDER_16RING = BRIGHT_CYAN + r"""
     .--..--..--..--.
    / .. \.. \.. \.. \
    \ \/\ \/\ \/\ \/ /
     \/ /\/ /\/ /\/ /
     / /\/ /\/ /\/ /\
    / /\ \/\ \/\ \/\ \
    \ \/\ \/\ \/\ \/ /
     \/ /\/ /\/ /\/ /
     / /\/ /\/ /\/ /\
    / /\ \/\ \/\ \/\ \
    \ \/\ \/\ \/\ \/ /
     \/ /\/ /\/ /\/ /
     / /\/ /\/ /\/ /\
    / /\ \/\ \/\ \/\ \
    \ `'\ `'\ `'\ `' /
     `--'`--'`--'`--'
""" + RESET

# Big Knot (Strategic Breaklines)
CELTIC_BORDER_BIG_KNOT = BRIGHT_GREEN + r"""
     .--..--..--..--.
    / .. \.. \.. \.. \
    \ \/\ \/\ \/\ \/ /
     \/ /\/ /\/ /\/ /
     / /`' /\/ /`' /\
    / /`--'\ \/`--'\ \
    \ \.--./\ \.--./ /
     \/ ../ /\/ ../ /
     / /\/ /`' /\/ /\
    / /\ \/`--'\ \/\ \
    \ \/\ \.--./\ \/ /
     \/ /\/ ../ /\/ /
     / /\/ /\/ /\/ /\
    / /\ \/\ \/\ \/\ \
    \ `'\ `'\ `'\ `' /
     `--'`--'`--'`--'
""" + RESET

# Frame Border Variations
CELTIC_FRAME_VARIANT1 = BRIGHT_YELLOW + r"""
     .--..--..--..--.       .--..--..--..--.       .--..--..--..--.
    / .. \.. \.. \.. \     / .. \.. \.. \.. \     / .. \.. \.. \.. \
    \ \/\ \/\ \/\ \/ /     \ \/\ \/\ \/\ \/ /     \ \/\ `'\ `'\ \/ /
     \/ /\/ /\/ /\/ /       \/ /\/ /\/ /\/ /       \/ /`--'`--'\/ /
     / /`' /`' /`' /\       / /`' /\/ /`' /\       / /\        / /\
    / /`--'`--'`--'\ \     / /`--'\ \/`--'\ \     / /\ \      / /\ \
    \ \.--.    .--./ /     \ \.--./\ \.--./ /     \ \/ /      \ \/ /
     \/ .. \  / ../ /       \/ ../ /\/ ../ /       \/ /        \/ /
     / /`' /  \ `' /\       / /`' /\/ /`' /\       / /\        / /\
    / /`--'    `--'\ \     / /`--'\ \/`--'\ \     / /\ \      / /\ \
    \ \.--..--..--./ /     \ \.--./\ \.--./ /     \ \/ /      \ \/ /
     \/ ../ ../ ../ /       \/ ../ /\/ ../ /       \/ /        \/ /
     / /\/ /\/ /\/ /\       / /\/ /\/ /\/ /\       / /\.--..--./ /\
    / /\ \/\ \/\ \/\ \     / /\ \/\ \/\ \/\ \     / /\ \.. \.. \/\ \
    \ `'\ `'\ `'\ `' /     \ `'\ `'\ `'\ `' /     \ `'\ `'\ `'\ `' /
     `--'`--'`--'`--'       `--'`--'`--'`--'       `--'`--'`--'`--'
""" + RESET

# Large Frame Border - Full Example
CELTIC_LARGE_FRAME = BRIGHT_MAGENTA + r"""
     .--..--..--..--..--..--..--..--..--..--..--..--..--..--..--..--.
    / .. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \
    \ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/ /
     \/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /
     / /\/ /`' /`' /`' /`' /`' /`' /`' /`' /`' /`' /`' /`' /`' /\/ /\
    / /\ \/`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'\ \/\ \
    \ \/\ \                                                    /\ \/ /
     \/ /\ \                                                  / /\/ /
     / /\/ /        A large frame border based on             \ \/ /\
    / /\ \/                                                    \ \/\ \
    \ \/\ \              celtic knots ...                      /\ \/ /
     \/ /\ \                                                  / /\/ /
     / /\/ /                                                  \ \/ /\
    / /\ \/                                                    \ \/\ \
    \ \/\ \.--..--..--..--..--..--..--..--..--..--..--..--..--./\ \/ /
     \/ /\/ ../ ../ ../ ../ ../ ../ ../ ../ ../ ../ ../ ../ ../ /\/ /
     / /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\
    / /\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \
    \ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `' /
     `--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'
""" + RESET

# Complex Frame with Inner Content
CELTIC_COMPLEX_FRAME = CYAN + r"""
       .--..--..--..--..--..--..--..--..--..--..--..--..--..--..--..--.
      / .. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \.. \
      \ \/\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ \/ /
       \/ /`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'\/ /
       / /\.--.                                                .--./ /\
      / /\ \.. \                                              / .. \/\ \
      \ \/\ \/ /     Well ... I think you got the basic      \ \/\ \/ /
       \/ /\/ /                                                \/ /\/ /
   .--./ /\/ /\         picture of the thing, so  ...          / /\/ /\.--.
  / .. \/\ \/\ \                                              / /\ \/\ \.. \
  \ \/\ `'\ `' /           go on and do it too :)             \ `'\ `'\ \/ /
   \/ /`--'`--'                                                `--'`--'\/ /
   / /\            .--..--..--..--..--..--..--..--..--..--.            / /\
  / /\ \          / .. \.. \.. \.. \.. \.. \.. \.. \.. \.. \          / /\ \
  \ \/ /          \ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/ /          \ \/ /
   \/ /            \/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /            \/ /
   / /\.--..--..--./ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\/ /\.--..--..--./ /\
  / /\ \.. \.. \.. \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \/\ \.. \.. \.. \/\ \
  \ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `'\ `' /
   `--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'
""" + RESET


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_key():
    """Get a single keypress including arrow keys"""
    if sys.platform == 'win32':
        # Windows
        key = msvcrt.getch()

        # Check for special keys (arrow keys start with \x00 or \xe0)
        if key in [b'\x00', b'\xe0']:
            key = msvcrt.getch()
            if key == b'H':  # Up arrow
                return 'UP'
            elif key == b'P':  # Down arrow
                return 'DOWN'
            elif key == b'M':  # Right arrow
                return 'RIGHT'
            elif key == b'K':  # Left arrow
                return 'LEFT'

        # Regular keys
        try:
            return key.decode('utf-8').upper()
        except:
            return ''
    else:
        # Unix-like systems
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            ch = sys.stdin.read(1)

            # Check for escape sequences (arrow keys)
            if ch == '\x1b':
                ch2 = sys.stdin.read(1)
                if ch2 == '[':
                    ch3 = sys.stdin.read(1)
                    if ch3 == 'A':
                        return 'UP'
                    elif ch3 == 'B':
                        return 'DOWN'
                    elif ch3 == 'C':
                        return 'RIGHT'
                    elif ch3 == 'D':
                        return 'LEFT'

            return ch.upper()
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)


def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')


def create_celtic_horizontal_border(width, color=CYAN):
    """
    Create a horizontal Celtic border using interlaced rings technique.
    Width should be number of ring pairs (each pair is about 4 chars wide)
    """
    # Each ring pair is: .--.
    # Pattern: .--. repeating
    top_line = color + "     " + (".--.") * width + RESET
    second_line = color + "    " + ("/ .. \\") * width + RESET
    third_line = color + "    "
    fourth_line = color + "     "

    # Build interlaced pattern
    for i in range(width):
        if i % 2 == 0:
            third_line += "\\ \\/ "
            fourth_line += "\\/ /"
        else:
            third_line += "/ /\\ "
            fourth_line += "/ /\\"

    third_line += RESET
    fourth_line += RESET

    return f"{top_line}\n{second_line}\n{third_line}\n{fourth_line}"


def create_celtic_side_borders(height, width, color=CYAN):
    """
    Create left and right Celtic borders for sides.
    Returns tuple of (left_border, right_border) as list of lines
    """
    left_lines = []
    right_lines = []

    for i in range(height):
        if i % 2 == 0:
            left_lines.append(color + "    / /\\" + RESET)
            right_lines.append(color + "/ /\\" + RESET)
        else:
            left_lines.append(color + "    \\ \\/" + RESET)
            right_lines.append(color + "\\ \\/" + RESET)

    return left_lines, right_lines


def strip_ansi(text):
    """Remove all ANSI color codes from text to get visible length"""
    import re
    ansi_escape = re.compile(r'\x1b\[[0-9;]*m')
    return ansi_escape.sub('', text)


def wrap_in_celtic_border(content_lines, color=CYAN, title=None):
    """
    Wrap content in a Celtic border frame with perfect alignment.
    Based EXACTLY on the tutorial's CELTIC_LARGE_FRAME pattern.
    content_lines: list of strings (each line of content)
    color: ANSI color code for the border
    title: optional title to display in top border
    """
    # Calculate visible width (strip ANSI codes) - find the longest line
    visible_lengths = [len(strip_ansi(line)) for line in content_lines]
    max_width = max(visible_lengths) if visible_lengths else 40

    # Calculate exact border width needed
    total_content_width = max_width + 4  # content + both 2-space margins
    ring_pairs = (total_content_width // 4) + 3

    # Create top border - EXACTLY matching CELTIC_LARGE_FRAME (lines 573-578)
    top_border = []

    # Line 573: 5 spaces + .--.  units
    top_border.append(color + "     " + (".--.") * ring_pairs + RESET)

    # Line 574: 4 spaces + / .. \ + then .. \ repeated
    line2 = color + "    / .. \\"
    for i in range(ring_pairs - 1):
        line2 += ".. \\"
    top_border.append(line2 + RESET)

    # Line 575: 4 spaces + \ \/ repeated, last one is \ \/ /
    line3 = color + "    "
    for i in range(ring_pairs - 1):
        line3 += "\\ \\/"
    line3 += "\\ \\/ /"
    top_border.append(line3 + RESET)

    # Line 576: 5 spaces + \/ / repeated (ring_pairs times)
    line4 = color + "     "
    for i in range(ring_pairs):
        line4 += "\\/ /"
    top_border.append(line4 + RESET)

    # Line 577: 5 spaces + / /\/ / + then `' / repeated + ending \/ /\
    line5 = color + "     / /\\/ /"
    for i in range(ring_pairs - 3):
        line5 += "`' /"
    line5 += "`' /\\/ /\\"
    top_border.append(line5 + RESET)

    # Line 578: 4 spaces + / /\ \/ + then `--' repeated + ending \ \/\ \
    line6 = color + "    / /\\ \\/"
    for i in range(ring_pairs - 2):
        line6 += "`--'"
    line6 += "\\ \\/\\ \\"
    top_border.append(line6 + RESET)

    # Add title if provided
    if title:
        title_line = color + "   / /\\" + RESET + f"  {BOLD}{GOLD}{title}{RESET}  " + color + "/ /\\" + RESET
        top_border.append(title_line)
        top_border.append(color + "   \\ \\/" + (" " * (max_width + 4)) + "\\ \\/" + RESET)

    # Create content area with side borders - EXACTLY matching tutorial
    # Tutorial uses a 4-STATE pattern, not 2-state!
    framed_content = []
    for i, line in enumerate(content_lines):
        # Calculate exact padding needed for this line
        visible_len = len(strip_ansi(line))
        padding_needed = max_width - visible_len

        # Use 4-state pattern EXACTLY as in CELTIC_LARGE_FRAME (lines 579-586)
        state = i % 4
        if state == 0:  # Line 579, 583 (i%4=0)
            left = color + "    \\ \\/\\ \\" + RESET
            right = color + "/\\ \\/ /" + RESET
        elif state == 1:  # Line 580, 584 (i%4=1)
            left = color + "     \\/ /\\ \\" + RESET
            right = color + "/ /\\/ /" + RESET
        elif state == 2:  # Line 581, 585 (i%4=2)
            left = color + "     / /\\/ /" + RESET
            right = color + "\\ \\/ /\\" + RESET
        else:  # state == 3: Line 582, 586 (i%4=3)
            left = color + "    / /\\ \\/" + RESET
            right = color + "\\ \\/\\ \\" + RESET

        # Build line with exact spacing
        framed_line = f"{left}  {line}{' ' * padding_needed}  {right}"
        framed_content.append(framed_line)

    # Create bottom border - EXACTLY matching CELTIC_LARGE_FRAME lines 587-592
    # Determine the starting state based on content line count (4-state pattern)
    bottom_border = []
    num_content_lines = len(content_lines)
    next_state = num_content_lines % 4  # State for the line after last content line

    # Line 587 equivalent: Use next state's borders with horizontal ring pattern
    # The tutorial has 8 content lines (indices 0-7), so line 587 is index 8, state 0
    # Pattern: left_border + "." + rings + "." + right_border (connected with dots)
    if next_state == 0:
        left_start = "    \\ \\/\\ \\"
        right_end = "/\\ \\/ /"
    elif next_state == 1:
        left_start = "     \\/ /\\ \\"
        right_end = "/ /\\/ /"
    elif next_state == 2:
        left_start = "     / /\\/ /"
        right_end = "\\ \\/ /\\"
    else:  # next_state == 3
        left_start = "    / /\\ \\/"
        right_end = "\\ \\/\\ \\"

    # Build bottom border line 1 - needs to match tutorial pattern exactly
    # Tutorial line 588: left_border + rings + right_border (with . connectors)
    # Use same ring_pairs as top border for proper width
    bline1 = color + left_start + (".--.") * ring_pairs + right_end
    bottom_border.append(bline1 + RESET)

    # Line 588 equivalent: \/ /\/ then  ../ repeated, ending with  /\/ /
    bline2 = color + "     \\/ /\\/"
    for i in range(ring_pairs):
        bline2 += " ../"
    bline2 += " /\\/ /"
    bottom_border.append(bline2 + RESET)

    # Line 589 equivalent: / / then \/ / repeated, ending with \/ /\
    bline3 = color + "     / /"
    for i in range(ring_pairs):
        bline3 += "\\/ /"
    bline3 += "\\/ /\\"
    bottom_border.append(bline3 + RESET)

    # Line 590 equivalent: / / then \ \/ repeated, ending with \ \/\ \
    bline4 = color + "    / /"
    for i in range(ring_pairs):
        bline4 += "\\ \\/"
    bline4 += "\\ \\/\\ \\"
    bottom_border.append(bline4 + RESET)

    # Line 591 equivalent: \ then `'\ repeated, ending with `' /
    bline5 = color + "    \\ "
    for i in range(ring_pairs):
        bline5 += "`'\\ "
    bline5 += "`' /"
    bottom_border.append(bline5 + RESET)

    # Line 592 equivalent: `--' repeated
    bottom_border.append(color + "     " + ("`--'") * ring_pairs + RESET)

    # Combine all parts
    result = []
    result.extend(top_border)
    result.extend(framed_content)
    result.extend(bottom_border)

    return "\n".join(result)


def print_header(title):
    """Print a fancy header"""
    print(f"\n{GOLD}{'=' * 80}{RESET}")
    print(f"{GOLD}  {title}{RESET}")
    print(f"{GOLD}{'=' * 80}{RESET}\n")


def print_menu():
    """Print the main menu with Celtic border"""
    clear_screen()

    # Build menu content as list of lines
    menu_lines = [
        "",
        f"{BOLD}{GOLD}※ ◊ ※ ◊ ※  CELTIC ART GALLERY - EXPANDED COLLECTION  ◊ ※ ◊ ※ ◊{RESET}",
        f"{GOLD}Celtic Art + Irish Symbols + Maps + Leprechauns + Border Tutorials!{RESET}",
        "",
        f"{CYAN}SELECT FROM {len(GALLERY_ITEMS)} ART PIECES:{RESET}",
        "",
        f"{BOLD}CELTIC ART (from asciiart.eu):{RESET}",
        f"  {GOLD}1{RESET}  - {BRIGHT_GREEN}Celtic Cross by Joan Stark{RESET} (jgs, classic)",
        f"  {GOLD}2{RESET}  - {CYAN}Celtic Knot 1{RESET} (basic interlaced)",
        f"  {GOLD}3{RESET}  - {MAGENTA}Celtic Knot 2{RESET} (extended weave)",
        f"  {GOLD}4{RESET}  - {BRIGHT_GREEN}Celtic Border{RESET} (repeating pattern)",
        f"  {GOLD}5{RESET}  - {YELLOW}Celtic Knot 3{RESET} (simple vertical)",
        f"  {GOLD}6{RESET}  - {BRIGHT_CYAN}Celtic Knot 4{RESET} (compact diamond)",
        f"  {GOLD}7{RESET}  - {CYAN}Large Celtic Knot{RESET} (massive pattern)",
        f"  {GOLD}8{RESET}  - {BRIGHT_MAGENTA}Celtic Knot 5{RESET} (tall vertical)",
        f"  {GOLD}9{RESET}  - {YELLOW}Elaborate Cross 1{RESET} (jgs, ornate variant 1)",
        f"  {GOLD}10{RESET} - {BRIGHT_YELLOW}Elaborate Cross 2{RESET} (jgs, ornate variant 2)",
        f"  {GOLD}11{RESET} - {BRIGHT_GREEN}Celtic Knot 6{RESET} (diamond weave)",
        f"  {GOLD}12{RESET} - {MAGENTA}Massive Weave{RESET} (HUGE intricate pattern)",
        f"  {GOLD}13{RESET} - {CYAN}Celtic Knot 7{RESET} (flowing pattern)",
        "",
        f"{BOLD}IRISH SYMBOLS (from COA-CMD-Tool):{RESET}",
        f"  {GOLD}14{RESET} - {BRIGHT_GREEN}Irish Shamrock{RESET} (symbol of Ireland)",
        f"  {GOLD}15{RESET} - {BRIGHT_GREEN}Celtic Cross Small{RESET} (compact)",
        f"  {GOLD}16{RESET} - {BRIGHT_GREEN}Celtic Cross Large{RESET} (detailed, intricate)",
        f"  {GOLD}17{RESET} - {BRIGHT_RED}Red Hand of Ulster{RESET} (ancient symbol)",
        "",
        f"{BOLD}IRISH GEOGRAPHY & FOLKLORE:{RESET}",
        f"  {GOLD}18{RESET} - {BRIGHT_GREEN}Map of Ireland - Small{RESET} (by ScS)",
        f"  {GOLD}19{RESET} - {BRIGHT_GREEN}Map of Ireland - Large{RESET} (by jorn)",
        f"  {GOLD}20{RESET} - {BRIGHT_GREEN}Leprechaun{RESET} (by jgs)",
        "",
        f"{BOLD}CELTIC BORDER TUTORIALS (Learn the Technique!):{RESET}",
        f"  {GOLD}21{RESET} - {CYAN}Basic Configuration{RESET} (foundation of Celtic borders)",
        f"  {GOLD}22{RESET} - {MAGENTA}8-Ring Pattern{RESET} (simple vertical interlacing)",
        f"  {GOLD}23{RESET} - {BRIGHT_CYAN}With Breaklines{RESET} (continuous knot paths!)",
        f"  {GOLD}24{RESET} - {YELLOW}16-Ring Pattern{RESET} (larger scaled border)",
        f"  {GOLD}25{RESET} - {BRIGHT_MAGENTA}Big Knot{RESET} (strategic breaklines)",
        f"  {GOLD}26{RESET} - {BRIGHT_GREEN}Frame Variants{RESET} (compare 3 approaches)",
        f"  {GOLD}27{RESET} - {BRIGHT_YELLOW}Large Frame{RESET} (complete border template!)",
        f"  {GOLD}28{RESET} - {BRIGHT_MAGENTA}Complex Frame{RESET} (all techniques combined!)",
        "",
        f"{BOLD}SPECIAL MODES:{RESET}",
        f"  {GOLD}G{RESET}  - {BRIGHT_CYAN}GALLERY MODE{RESET} (cycle through all art with arrow keys!)",
        f"  {GOLD}Q{RESET}  - {BRIGHT_RED}Exit{RESET}",
        "",
        f"{DIM}※ 28 unique art pieces! All colors preserved! ※{RESET}",
        f"{BRIGHT_CYAN}TIP: Press G or just hit Enter to start Gallery Mode!{RESET}",
        f"{YELLOW}In Gallery Mode: Use <- -> arrow keys or L/R to navigate!{RESET}",
        ""
    ]

    # Wrap menu in Celtic border using the technique we learned!
    bordered_menu = wrap_in_celtic_border(menu_lines, color=BRIGHT_GREEN, title=None)
    print(bordered_menu)


# ============================================================================
# DISPLAY FUNCTIONS
# ============================================================================

def show_celtic_cross_jgs():
    clear_screen()
    print_header("CELTIC CROSS - by Joan Stark (jgs)")
    print(CELTIC_CROSS_JGS)
    print(f"\n{CYAN}Classic Celtic cross by renowned ASCII artist Joan Stark.{RESET}")
    print(f"{CYAN}From asciiart.eu Celtic collection.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_1():
    clear_screen()
    print_header("CELTIC KNOT 1 - Basic Interlaced")
    print(CELTIC_KNOT_1)
    print(f"\n{CYAN}Traditional interlaced Celtic knotwork.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_2():
    clear_screen()
    print_header("CELTIC KNOT 2 - Extended Weave")
    print(CELTIC_KNOT_2)
    print(f"\n{CYAN}Extended weave pattern with complex interlacing.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_border():
    clear_screen()
    print_header("CELTIC BORDER - Repeating Pattern")
    print(CELTIC_BORDER)
    print(f"\n{CYAN}Celtic border design for framing text or art.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_3():
    clear_screen()
    print_header("CELTIC KNOT 3 - Simple Vertical")
    print(CELTIC_KNOT_3)
    print(f"\n{CYAN}Simple vertical Celtic pattern.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_4():
    clear_screen()
    print_header("CELTIC KNOT 4 - Compact Diamond")
    print(CELTIC_KNOT_4)
    print(f"\n{CYAN}Compact diamond-shaped Celtic knot.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_large_knot():
    clear_screen()
    print_header("LARGE CELTIC KNOT - Massive Pattern")
    print(LARGE_CELTIC_KNOT)
    print(f"\n{CYAN}Large, intricate Celtic knotwork pattern.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_5():
    clear_screen()
    print_header("CELTIC KNOT 5 - Tall Vertical")
    print(CELTIC_KNOT_5)
    print(f"\n{CYAN}Tall vertical Celtic knotwork design.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_elaborate_1():
    clear_screen()
    print_header("ELABORATE CELTIC CROSS 1 - by Joan Stark (jgs)")
    print(ELABORATE_CROSS_1)
    print(f"\n{CYAN}Ornate Celtic cross with intricate detail, variant 1.{RESET}")
    print(f"{CYAN}Created by Joan Stark (jgs).{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_elaborate_2():
    clear_screen()
    print_header("ELABORATE CELTIC CROSS 2 - by Joan Stark (jgs)")
    print(ELABORATE_CROSS_2)
    print(f"\n{CYAN}Ornate Celtic cross with intricate detail, variant 2.{RESET}")
    print(f"{CYAN}Created by Joan Stark (jgs).{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_6():
    clear_screen()
    print_header("CELTIC KNOT 6 - Diamond Weave")
    print(CELTIC_KNOT_6)
    print(f"\n{CYAN}Diamond weave Celtic pattern.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_massive_weave():
    clear_screen()
    print_header("MASSIVE CELTIC WEAVE - HUGE Intricate Pattern")
    print(MASSIVE_WEAVE)
    print(f"\n{CYAN}The largest and most intricate Celtic weave pattern!{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_knot_7():
    clear_screen()
    print_header("CELTIC KNOT 7 - Flowing Pattern")
    print(CELTIC_KNOT_7)
    print(f"\n{CYAN}Flowing Celtic knotwork with dynamic design.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_shamrock():
    clear_screen()
    print_header("IRISH SHAMROCK - Symbol of Ireland")
    print(SHAMROCK)
    print(f"\n{CYAN}The shamrock (seamróg), traditional symbol of Ireland.{RESET}")
    print(f"{CYAN}Saint Patrick used it to explain the Holy Trinity.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_celtic_cross_small():
    clear_screen()
    print_header("CELTIC CROSS - Compact Version")
    print(CELTIC_CROSS_SMALL)
    print(f"\n{CYAN}Compact Celtic cross from Irish heraldry collection.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_celtic_cross_large():
    clear_screen()
    print_header("CELTIC CROSS - Detailed Large Version")
    print(CELTIC_CROSS)
    print(f"\n{CYAN}Large, detailed Celtic cross with intricate knotwork.{RESET}")
    print(f"{CYAN}The circle represents eternity, the cross represents faith.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_red_hand():
    clear_screen()
    print_header("RED HAND OF ULSTER - Ancient Irish Symbol")
    print(RED_HAND_ART)
    print(f"\n{CYAN}The Red Hand of Ulster - ancient symbol of many Irish families.{RESET}")
    print(f"{CYAN}Associated with the province of Ulster and numerous clans.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_ireland_map_small():
    clear_screen()
    print_header("MAP OF IRELAND - Small - by ScS")
    print(IRELAND_MAP_SMALL)
    print(f"\n{CYAN}Compact map outline of the Emerald Isle.{RESET}")
    print(f"{CYAN}Created by ScS.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_ireland_map_large():
    clear_screen()
    print_header("MAP OF IRELAND - Large - by jorn")
    print(IRELAND_MAP_LARGE)
    print(f"\n{CYAN}Detailed map showing the shape of Ireland.{RESET}")
    print(f"{CYAN}Created by jorn.{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")

def show_leprechaun():
    clear_screen()
    print_header("LEPRECHAUN - Traditional Irish Fairy - by Joan Stark (jgs)")
    print(LEPRECHAUN)
    print(f"\n{CYAN}Traditional Irish leprechaun - the mischievous fairy of Irish folklore!{RESET}")
    print(f"{CYAN}Wearing his classic hat and buckled shoes.{RESET}")
    print(f"{BRIGHT_GREEN}Look for his pot of gold at the end of the rainbow! 🍀{RESET}")
    print(f"{CYAN}Created by Joan Stark (jgs).{RESET}")
    input(f"\n{DIM}Press Enter to return...{RESET}")


# ============================================================================
# GALLERY DATA - All art pieces organized
# ============================================================================

GALLERY_ITEMS = [
    {
        'name': 'Celtic Cross by Joan Stark',
        'art': CELTIC_CROSS_JGS,
        'desc': 'Classic Celtic cross by renowned ASCII artist Joan Stark.\nFrom asciiart.eu Celtic collection.'
    },
    {
        'name': 'Celtic Knot 1 - Basic Interlaced',
        'art': CELTIC_KNOT_1,
        'desc': 'Traditional interlaced Celtic knotwork.'
    },
    {
        'name': 'Celtic Knot 2 - Extended Weave',
        'art': CELTIC_KNOT_2,
        'desc': 'Extended weave pattern with complex interlacing.'
    },
    {
        'name': 'Celtic Border - Repeating Pattern',
        'art': CELTIC_BORDER,
        'desc': 'Celtic border design for framing text or art.'
    },
    {
        'name': 'Celtic Knot 3 - Simple Vertical',
        'art': CELTIC_KNOT_3,
        'desc': 'Simple vertical Celtic pattern.'
    },
    {
        'name': 'Celtic Knot 4 - Compact Diamond',
        'art': CELTIC_KNOT_4,
        'desc': 'Compact diamond-shaped Celtic knot.'
    },
    {
        'name': 'Large Celtic Knot - Massive Pattern',
        'art': LARGE_CELTIC_KNOT,
        'desc': 'Large, intricate Celtic knotwork pattern.'
    },
    {
        'name': 'Celtic Knot 5 - Tall Vertical',
        'art': CELTIC_KNOT_5,
        'desc': 'Tall vertical Celtic knotwork design.'
    },
    {
        'name': 'Elaborate Celtic Cross 1 (jgs)',
        'art': ELABORATE_CROSS_1,
        'desc': 'Ornate Celtic cross with intricate detail, variant 1.\nCreated by Joan Stark (jgs).'
    },
    {
        'name': 'Elaborate Celtic Cross 2 (jgs)',
        'art': ELABORATE_CROSS_2,
        'desc': 'Ornate Celtic cross with intricate detail, variant 2.\nCreated by Joan Stark (jgs).'
    },
    {
        'name': 'Celtic Knot 6 - Diamond Weave',
        'art': CELTIC_KNOT_6,
        'desc': 'Diamond weave Celtic pattern.'
    },
    {
        'name': 'Massive Celtic Weave - HUGE Pattern',
        'art': MASSIVE_WEAVE,
        'desc': 'The largest and most intricate Celtic weave pattern!'
    },
    {
        'name': 'Celtic Knot 7 - Flowing Pattern',
        'art': CELTIC_KNOT_7,
        'desc': 'Flowing Celtic knotwork with dynamic design.'
    },
    {
        'name': 'Irish Shamrock',
        'art': SHAMROCK,
        'desc': 'The shamrock (seamróg), traditional symbol of Ireland.\nSaint Patrick used it to explain the Holy Trinity.'
    },
    {
        'name': 'Celtic Cross - Compact',
        'art': CELTIC_CROSS_SMALL,
        'desc': 'Compact Celtic cross from Irish heraldry collection.'
    },
    {
        'name': 'Celtic Cross - Large Detailed',
        'art': CELTIC_CROSS,
        'desc': 'Large, detailed Celtic cross with intricate knotwork.\nThe circle represents eternity, the cross represents faith.'
    },
    {
        'name': 'Red Hand of Ulster',
        'art': RED_HAND_ART,
        'desc': 'The Red Hand of Ulster - ancient symbol of many Irish families.\nAssociated with the province of Ulster and numerous clans.'
    },
    {
        'name': 'Map of Ireland - Small',
        'art': IRELAND_MAP_SMALL,
        'desc': 'Compact map outline of the Emerald Isle.\nCreated by ScS.'
    },
    {
        'name': 'Map of Ireland - Large',
        'art': IRELAND_MAP_LARGE,
        'desc': 'Detailed map showing the shape of Ireland.\nCreated by jorn.'
    },
    {
        'name': 'Leprechaun',
        'art': LEPRECHAUN,
        'desc': 'Traditional Irish leprechaun - the mischievous fairy of Irish folklore!\nWearing his classic hat and buckled shoes.\nCreated by Joan Stark (jgs).'
    },
    {
        'name': 'Celtic Border Tutorial - Basic Configuration',
        'art': CELTIC_BORDER_BASIC,
        'desc': 'Basic configuration showing interlaced rings.\nThis is the foundation for creating Celtic borders.\nStudy how the rings overlap to create the interlaced effect.'
    },
    {
        'name': 'Celtic Border Tutorial - 8-Ring Pattern',
        'art': CELTIC_BORDER_8RING,
        'desc': 'Simple 8-ring pattern showing vertical interlacing.\nNotice the alternating over/under weave pattern.'
    },
    {
        'name': 'Celtic Border Tutorial - With Breaklines',
        'art': CELTIC_BORDER_BREAKLINES,
        'desc': 'Demonstrates horizontal and vertical breaklines.\nBreaklines create gaps that form continuous knot paths.\nThis technique is essential for complex Celtic designs!'
    },
    {
        'name': 'Celtic Border Tutorial - 16-Ring Pattern',
        'art': CELTIC_BORDER_16RING,
        'desc': 'Larger 16-ring pattern with more complex interlacing.\nShows how the pattern scales for bigger borders.'
    },
    {
        'name': 'Celtic Border Tutorial - Big Knot',
        'art': CELTIC_BORDER_BIG_KNOT,
        'desc': 'Big knot with strategic breaklines creating continuous paths.\nSee how the top and bottom rings connect through the vertical weave.'
    },
    {
        'name': 'Celtic Border Tutorial - Frame Variants',
        'art': CELTIC_FRAME_VARIANT1,
        'desc': 'Three frame variations showing different border approaches.\nCompare the different techniques for creating corners and edges.'
    },
    {
        'name': 'Celtic Border Tutorial - Large Frame',
        'art': CELTIC_LARGE_FRAME,
        'desc': 'Full large frame example with interior space for content.\nThis demonstrates how to create a complete border around text or art.\nPerfect template for framing your own content!'
    },
    {
        'name': 'Celtic Border Tutorial - Complex Frame',
        'art': CELTIC_COMPLEX_FRAME,
        'desc': 'Complex frame with inner content and encouragement message.\n"Well ... I think you got the basic picture of the thing, so ... go on and do it too :)"\nThe most complete example showing all techniques combined!'
    },
]


def show_gallery_item(index):
    """Display a single gallery item with navigation info"""
    clear_screen()
    item = GALLERY_ITEMS[index]

    print(f"\n{GOLD}{'=' * 80}{RESET}")
    print(f"{GOLD}  [{index + 1}/{len(GALLERY_ITEMS)}] {item['name']}{RESET}")
    print(f"{GOLD}{'=' * 80}{RESET}\n")

    print(item['art'])

    print(f"\n{CYAN}{item['desc']}{RESET}\n")

    print(f"{DIM}{'─' * 80}{RESET}")
    print(f"{YELLOW}← LEFT ARROW{RESET} = Previous  |  {YELLOW}→ RIGHT ARROW{RESET} = Next  |  {YELLOW}M{RESET} = Menu  |  {YELLOW}Q{RESET} = Quit")
    print(f"{BRIGHT_CYAN}Also: ENTER = Next, L = Previous, R = Next{RESET}")
    print(f"{DIM}{'─' * 80}{RESET}")


def gallery_mode():
    """Gallery mode with arrow key navigation"""
    current_index = 0

    while True:
        show_gallery_item(current_index)

        # Get key press (including arrow keys)
        print(f"\n{GOLD}Press any key to navigate (arrow keys work!): {RESET}", end='', flush=True)
        choice = get_key()

        if choice == 'Q':
            return 'quit'
        elif choice == 'M':
            return 'menu'
        elif choice in ['RIGHT', 'R', '\r', '\n']:  # Right arrow, R, or Enter
            current_index = (current_index + 1) % len(GALLERY_ITEMS)
        elif choice in ['LEFT', 'L']:  # Left arrow or L
            current_index = (current_index - 1) % len(GALLERY_ITEMS)
        elif choice == 'UP':  # Up arrow - go to previous
            current_index = (current_index - 1) % len(GALLERY_ITEMS)
        elif choice == 'DOWN':  # Down arrow - go to next
            current_index = (current_index + 1) % len(GALLERY_ITEMS)
        elif choice.isdigit():
            num = int(choice)
            if 1 <= num <= 9:  # Only single digits work with getch
                current_index = num - 1 if num <= len(GALLERY_ITEMS) else current_index


# ============================================================================
# MAIN PROGRAM
# ============================================================================

def main():
    """Main program loop"""
    while True:
        print_menu()
        choice = input(f"{GOLD}Enter your choice (or press G for Gallery Mode): {RESET}").strip().upper()

        if choice == 'G' or choice == '':
            # Start gallery mode
            result = gallery_mode()
            if result == 'quit':
                break
            # If result is 'menu', loop continues and shows menu again
        elif choice == '1':
            show_celtic_cross_jgs()
        elif choice == '2':
            show_knot_1()
        elif choice == '3':
            show_knot_2()
        elif choice == '4':
            show_border()
        elif choice == '5':
            show_knot_3()
        elif choice == '6':
            show_knot_4()
        elif choice == '7':
            show_large_knot()
        elif choice == '8':
            show_knot_5()
        elif choice == '9':
            show_elaborate_1()
        elif choice == '10':
            show_elaborate_2()
        elif choice == '11':
            show_knot_6()
        elif choice == '12':
            show_massive_weave()
        elif choice == '13':
            show_knot_7()
        elif choice == '14':
            show_shamrock()
        elif choice == '15':
            show_celtic_cross_small()
        elif choice == '16':
            show_celtic_cross_large()
        elif choice == '17':
            show_red_hand()
        elif choice == '18':
            show_ireland_map_small()
        elif choice == '19':
            show_ireland_map_large()
        elif choice == '20':
            show_leprechaun()
        elif choice == '21':
            show_gallery_item(20)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '22':
            show_gallery_item(21)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '23':
            show_gallery_item(22)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '24':
            show_gallery_item(23)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '25':
            show_gallery_item(24)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '26':
            show_gallery_item(25)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '27':
            show_gallery_item(26)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == '28':
            show_gallery_item(27)
            input(f"\n{DIM}Press Enter to return...{RESET}")
        elif choice == 'Q':
            break
        else:
            print(f"\n{BRIGHT_RED}Invalid choice! Please try again.{RESET}")
            input(f"\n{DIM}Press Enter to continue...{RESET}")

    clear_screen()
    print(f"\n{GOLD}╔═══════════════════════════════════════════════════════════╗{RESET}")
    print(f"{GOLD}║  ※ Go raibh maith agat (Thank you) ※                    ║{RESET}")
    print(f"{GOLD}║  May the Celtic spirits bless your path!                ║{RESET}")
    print(f"{GOLD}╚═══════════════════════════════════════════════════════════╝{RESET}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        clear_screen()
        print(f"\n{GOLD}※ Go raibh maith agat (Thank you) ※{RESET}\n")
