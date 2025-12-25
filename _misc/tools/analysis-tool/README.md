# ✟ Bible Analysis Tool - CMD Reader

> A beautiful command-line Bible analysis tool with multiple translations, keyword search, and 340,000+ cross-references

**Created by [@Ringmast4r](https://github.com/Ringmast4r)**

> **📌 Note:** This is **one of four ways** to explore Bible cross-references in this project!
> - **💻 This Tool (CMD Reader)** - Text-based reading and search
> - **🌐 [Web Visualizer](../bible-visualizer-web/)** - Interactive browser visualizations
> - **🖥️ [Desktop GUI](../bible-visualizer-desktop/)** - 3D graphs and professional analysis
> - **⌨️ [Web Terminal](../bible-cmd-web/)** - Browser-based CMD demo

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)
![Python](https://img.shields.io/badge/python-3.6%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why Use the CMD Reader?

**Best for:**
- 📖 Reading Bible verses and chapters
- 🔍 Searching keywords across 4 translations
- 📚 Studying cross-references in text format
- ⚡ Quick lookups without launching a GUI
- 💻 Working in terminal/command line environments

**Not for visualizations?** Check out the [Web Visualizer](../bible-visualizer-web/) or [Desktop GUI](../bible-visualizer-desktop/) instead!

---

## 🌟 Features

### 📖 **Multiple Bible Translations**
- **KJV** - King James Version (1611)
- **ASV** - American Standard Version (1901)
- **WEB** - World English Bible (2000)
- **YLT** - Young's Literal Translation (1898)
- Switch between translations instantly

### 🔍 **Powerful Search**
- Search by keyword across all 31,000+ verses
- Highlighted search results
- Case-insensitive matching

### 🔗 **Cross-References**
- 340,000+ cross-references from Treasury of Scripture Knowledge
- See related verses automatically when reading
- Discover connections throughout Scripture

### 🎨 **Beautiful Interface**
- Color-coded display with gold, cyan, and vibrant highlights
- Unicode box-drawing characters for elegant formatting
- Daily inspirational verse on startup
- Clean, modern terminal UI

### 📚 **Reading Modes**
- Read individual verses with cross-references
- Read entire chapters at once
- Word-wrapped text for readability
- Verse numbering and paragraph markers

---

## 🚀 Quick Start

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bible-analysis-tool.git
   cd bible-analysis-tool
   ```

2. **Install dependencies:**
   ```bash
   pip install colorama
   ```

3. **Run the application:**
   ```bash
   python bible_reader.py
   ```

   **Or on Windows, double-click:**
   ```
   bible.bat
   ```

---

## 📋 Usage

### Basic Commands

Once the program is running, you can:

| Command | Example | Description |
|---------|---------|-------------|
| **Read a verse** | `John 3:16` | Display verse with cross-references |
| **Read a chapter** | `Psalms 23` | Display entire chapter |
| **Search keyword** | `love` | Find all verses containing the word |
| **Daily verse** | `daily` | Show new inspirational verse |
| **List translations** | `translations` | Show all available Bible versions |
| **Switch translation** | `translation ASV` | Change to a different version |
| **Quit** | `quit` or `q` | Exit the program |

### Example Session

```
⊳ Enter your choice: John 3:16

╔══════════════════════════════════════════════════════════════════╗
║                           John 3:16                            ║
╚══════════════════════════════════════════════════════════════════╝

  For God so loved the world, that he gave his only begotten
  Son, that whosoever believeth in him should not perish, but
  have everlasting life.

┌──────────────────────────────────────────────────────────────────┐
│  ★ Related Verses (Cross-References)                          │
└──────────────────────────────────────────────────────────────────┘

  [1] Romans 5:8
      But God commendeth his love toward us...

  [2] 1 John 4:9
      In this was manifested the love of God...

      ... and 18 more related verses
```

---

## 🗂️ Project Structure

```
bible-analysis-tool/
├── bible_reader.py              # Main application
├── convert_translations.py      # Translation format converter
├── preview.py                   # Feature preview script
├── bible.bat                    # Windows launcher
│
├── bible-kjv-converted.json     # King James Version
├── bible-asv-converted.json     # American Standard Version
├── bible-web-converted.json     # World English Bible
├── bible-ylt-converted.json     # Young's Literal Translation
├── cross_references.txt         # 340,000+ cross-references
│
├── README.md                    # This file
├── LICENSE                      # MIT License
├── CHANGELOG.md                 # Version history
├── MEMORY.md                    # Development notes
├── QUICKSTART.txt               # Quick start guide
└── VISUAL_GUIDE.txt             # Visual features guide
```

---

## 🎯 Purpose & Vision

This tool was created to help people engage with Scripture through technology, making Bible study more accessible, interconnected, and beautiful. By combining multiple translations with comprehensive cross-references, users can:

- **Discover connections** between different parts of the Bible
- **Compare translations** to gain deeper understanding
- **Search efficiently** for themes and keywords
- **Study systematically** with cross-references guiding the way

Perfect for personal devotions, sermon preparation, Bible study groups, or anyone seeking to explore God's Word.

---

## 📊 Data Sources

### Bible Texts
All translations are in the public domain:

- **KJV**: GitHub - farskipper/kjv
- **ASV**: GitHub - bibleapi/bibleapi-bibles-json
- **WEB**: GetBible API (api.getbible.net)
- **YLT**: GetBible API (api.getbible.net)

### Cross-References
- **Source**: [OpenBible.info](https://www.openbible.info/labs/cross-references/)
- **Based on**: Treasury of Scripture Knowledge (TSK)
- **License**: Creative Commons Attribution
- **Count**: 340,000+ verse connections

---

## 🛠️ Technical Details

### Requirements
- Python 3.6 or higher
- colorama library (for Windows color support)

### Key Technologies
- **colorama**: Cross-platform terminal colors
- **JSON**: Data storage format
- **UTF-8 encoding**: Proper Unicode support
- **ANSI escape codes**: Terminal formatting

### Performance
- Loads 31,000+ verses instantly
- Fast keyword search across entire Bible
- Efficient cross-reference lookup
- Memory-optimized data structures

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Add more public domain translations
- Implement verse comparison view
- Add bookmarking/favorites system
- Create study notes feature
- Develop mobile-friendly version
- Add audio Bible integration

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Bible Text Licenses
All included Bible translations (KJV, ASV, WEB, YLT) are in the **public domain**.

### Cross-Reference License
Cross-reference data from OpenBible.info is licensed under **Creative Commons Attribution**.

---

## 🙏 Acknowledgments

- **Treasury of Scripture Knowledge** - For the comprehensive cross-reference system compiled over centuries
- **OpenBible.info** - For digitizing and enhancing the TSK cross-references
- **Bible API Contributors** - For making Bible data freely available in modern formats
- **Colorama Project** - For cross-platform terminal color support

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [MEMORY.md](MEMORY.md) file for development notes and troubleshooting

---

**May God bless your study of His Word!** ✟

