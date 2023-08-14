const baseUrl = "https://api.github.com";

const githubClient = {};

githubClient.getIssuesForRepo = async (repoUrl, pageNumber) => {
  try {
    // Separate the owner and repo name
    const formattedRepo = repoUrl.split("https://github.com/").pop();
    const response = await (
      await fetch(`${baseUrl}/repos/${formattedRepo}/issues?page=${pageNumber}`)
    ).json();

    if (response.message) {
      throw new Error(response.message);
    }
    return { success: true, result: response };
  } catch (err) {
    console.error(err.message);
    return { error: err.message };
  }
};

export default githubClient;
