export default async function fetchTopHackerNews(limit = 10) {
  const baseUrl = "https://hacker-news.firebaseio.com/v0";

  try {
    // Fetch top story IDs
    const res = await fetch(`${baseUrl}/topstories.json`);
    const ids = await res.json();

    // Take only top N (limit)
    const topIds = ids.slice(0, limit);

    // Fetch stories in parallel
    const stories = await Promise.all(
      topIds.map(async (id) => {
        const r = await fetch(`${baseUrl}/item/${id}.json`);
        return r.json();
      })
    );

    // Clean and format
    const formatted = stories.map((story, index) => ({
      rank: index + 1,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      author: story.by,
      score: story.score,
      time: new Date(story.time * 1000).toLocaleString(),
      comments: story.descendants ?? 0,
    }));

    return formatted;
  } catch (error) {
    console.error("❌ Failed to fetch Hacker News stories:", error);
  }
}
