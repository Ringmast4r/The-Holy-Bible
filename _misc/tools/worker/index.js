// BIBLE API Worker - Smart data filtering for Bible Cross-Reference Visualizer
// By @Ringmast4r - https://github.com/Ringmast4r
// Replaces 15MB+ client-side downloads with filtered API responses

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for frontend access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route to appropriate endpoint
      if (path === '/api/graph') {
        return handleGraph(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/api/stats') {
        return handleStats(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/api/book') {
        return handleBook(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/api/chapter') {
        return handleChapter(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/api/theographic') {
        return handleTheographic(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/api/preview') {
        return handlePreview(url, env.BIBLE_DATA, corsHeaders);
      } else if (path === '/') {
        return handleRoot(corsHeaders);
      } else {
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: corsHeaders,
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

// Load graph data from R2
async function loadGraphData(bucket) {
  const object = await bucket.get('graph_data.json');
  if (!object) {
    throw new Error('Graph data not found in R2 bucket');
  }
  const text = await object.text();
  return JSON.parse(text);
}

// Load stats from R2
async function loadStats(bucket) {
  const object = await bucket.get('stats.json');
  if (!object) {
    throw new Error('Stats data not found in R2 bucket');
  }
  const text = await object.text();
  return JSON.parse(text);
}

// Load theographic data from R2
async function loadTheographicData(bucket, filename) {
  const object = await bucket.get(`theographic/${filename}`);
  if (!object) {
    throw new Error(`Theographic data not found: ${filename}`);
  }
  const text = await object.text();
  return JSON.parse(text);
}

// /api/graph?testament=OT|NT|all&limit=1000 - Get filtered cross-reference connections
async function handleGraph(url, bucket, headers) {
  const testament = url.searchParams.get('testament') || 'all';
  const limit = parseInt(url.searchParams.get('limit') || '1000');
  const minWeight = parseInt(url.searchParams.get('minWeight') || '1');

  const graphData = await loadGraphData(bucket);
  let connections = graphData.connections;

  // Filter by testament
  if (testament !== 'all') {
    connections = connections.filter(conn => {
      const sourceChapter = graphData.chapters[conn.source];
      const targetChapter = graphData.chapters[conn.target];

      if (testament === 'OT') {
        return sourceChapter.testament === 'OT' && targetChapter.testament === 'OT';
      } else if (testament === 'NT') {
        return sourceChapter.testament === 'NT' && targetChapter.testament === 'NT';
      } else if (testament === 'cross') {
        return sourceChapter.testament !== targetChapter.testament;
      }
      return true;
    });
  }

  // Filter by weight
  if (minWeight > 1) {
    connections = connections.filter(conn => conn.weight >= minWeight);
  }

  // Limit results
  connections = connections.slice(0, limit);

  return new Response(JSON.stringify({
    metadata: {
      ...graphData.metadata,
      filtered: true,
      testament: testament,
      limit: limit,
      minWeight: minWeight,
      results: connections.length
    },
    books: graphData.books,
    chapters: graphData.chapters,
    connections: connections,
    book_matrix: graphData.book_matrix
  }), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}

// /api/stats - Get statistics
async function handleStats(url, bucket, headers) {
  const stats = await loadStats(bucket);

  return new Response(JSON.stringify(stats), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

// /api/book?name=Genesis - Get all connections for a specific book
async function handleBook(url, bucket, headers) {
  const bookName = url.searchParams.get('name');
  if (!bookName) {
    return new Response(JSON.stringify({ error: 'Missing parameter: name' }), {
      status: 400,
      headers,
    });
  }

  const graphData = await loadGraphData(bucket);

  // Filter connections by book
  const connections = graphData.connections.filter(conn => {
    const sourceChapter = graphData.chapters[conn.source];
    const targetChapter = graphData.chapters[conn.target];
    return sourceChapter.book === bookName || targetChapter.book === bookName;
  });

  return new Response(JSON.stringify({
    book: bookName,
    connections: connections.length,
    results: connections,
    chapters: graphData.chapters,
    books: graphData.books
  }), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// /api/chapter?id=123 - Get all connections for a specific chapter
async function handleChapter(url, bucket, headers) {
  const chapterId = parseInt(url.searchParams.get('id'));
  if (isNaN(chapterId)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid parameter: id' }), {
      status: 400,
      headers,
    });
  }

  const graphData = await loadGraphData(bucket);

  // Filter connections by chapter
  const connections = graphData.connections.filter(conn =>
    conn.source === chapterId || conn.target === chapterId
  );

  const chapter = graphData.chapters[chapterId];

  return new Response(JSON.stringify({
    chapter: chapter,
    connections: connections.length,
    results: connections,
    chapters: graphData.chapters,
    books: graphData.books
  }), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// /api/theographic?type=people|places|events - Get theographic data
async function handleTheographic(url, bucket, headers) {
  const type = url.searchParams.get('type');
  const validTypes = ['people', 'places', 'events', 'periods', 'peopleGroups', 'verses', 'chapters', 'books', 'easton'];

  if (!type || !validTypes.includes(type)) {
    return new Response(JSON.stringify({
      error: 'Missing or invalid parameter: type',
      validTypes: validTypes
    }), {
      status: 400,
      headers,
    });
  }

  const data = await loadTheographicData(bucket, `${type}.json`);

  return new Response(JSON.stringify({
    type: type,
    count: Array.isArray(data) ? data.length : Object.keys(data).length,
    data: data
  }), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

// /api/preview - Get preview data (top 200 connections)
async function handlePreview(url, bucket, headers) {
  const graphData = await loadGraphData(bucket);

  // Get top 200 strongest connections
  const topConnections = graphData.connections
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 200);

  return new Response(JSON.stringify({
    metadata: {
      ...graphData.metadata,
      is_preview: true,
      preview_connections: 200
    },
    books: graphData.books,
    chapters: graphData.chapters,
    connections: topConnections
  }), {
    headers: {
      ...headers,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// Root endpoint - API documentation
function handleRoot(headers) {
  const docs = {
    name: 'Bible Cross-Reference API',
    version: '1.0.0',
    author: '@Ringmast4r',
    github: 'https://github.com/Ringmast4r/BIBLE',
    website: 'https://getproselytized.com',
    endpoints: {
      '/api/graph': 'Get cross-reference connections. Params: ?testament=OT|NT|all&limit=1000&minWeight=1',
      '/api/stats': 'Get comprehensive statistics',
      '/api/book': 'Get all connections for a book. Params: ?name=Genesis',
      '/api/chapter': 'Get all connections for a chapter. Params: ?id=123',
      '/api/theographic': 'Get theographic data. Params: ?type=people|places|events|periods|peopleGroups|verses|chapters|books|easton',
      '/api/preview': 'Get preview data (top 200 connections)',
    },
    examples: [
      '/api/graph?testament=NT&limit=500',
      '/api/book?name=John',
      '/api/chapter?id=1',
      '/api/theographic?type=people',
      '/api/preview',
      '/api/stats',
    ],
    dataSource: 'Treasury of Scripture Knowledge + Theographic Bible Metadata',
    totalConnections: '340,000+ cross-references',
    totalPeople: '3,394 biblical people',
    totalPlaces: '1,638 geographic locations'
  };

  return new Response(JSON.stringify(docs, null, 2), { headers });
}
