// WEB WORKER - JSON PARSING
// Parses large JSON files in background thread to keep UI smooth

self.addEventListener('message', async (event) => {
  const { type, url, data } = event.data;

  try {
    switch (type) {
      case 'PARSE_URL':
        // Fetch and parse JSON from URL
        console.log('[Worker] Fetching and parsing:', url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const jsonData = await response.json();
        console.log('[Worker] Parsed successfully:', url);

        self.postMessage({
          type: 'SUCCESS',
          data: jsonData,
          url: url
        });
        break;

      case 'PARSE_DATA':
        // Parse JSON string
        console.log('[Worker] Parsing JSON data...');
        const parsed = JSON.parse(data);
        console.log('[Worker] Parsed successfully');

        self.postMessage({
          type: 'SUCCESS',
          data: parsed
        });
        break;

      case 'FILTER_CONNECTIONS':
        // Filter connections by testament
        console.log('[Worker] Filtering connections...');
        const { connections, chapters, testament } = event.data;

        const filtered = connections.filter(conn => {
          const sourceChapter = chapters[conn.source];
          const targetChapter = chapters[conn.target];

          if (testament === 'all') return true;
          if (testament === 'OT') {
            return sourceChapter.testament === 'OT' && targetChapter.testament === 'OT';
          }
          if (testament === 'NT') {
            return sourceChapter.testament === 'NT' && targetChapter.testament === 'NT';
          }
          if (testament === 'cross') {
            return sourceChapter.testament !== targetChapter.testament;
          }
          return true;
        });

        console.log('[Worker] Filtered:', filtered.length, 'connections');

        self.postMessage({
          type: 'SUCCESS',
          data: filtered
        });
        break;

      default:
        throw new Error(`Unknown worker task: ${type}`);
    }
  } catch (error) {
    console.error('[Worker] Error:', error);
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
});

console.log('[Worker] JSON Parser Worker ready');
