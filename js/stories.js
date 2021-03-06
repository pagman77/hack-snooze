"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const starClass = currentUser.userFavoriteIds.has(story.storyId)
    ? "fa-solid"
    : "fa-regular";


  return $(`
      <li id="${story.storyId}">
      <i class="fa-solid fa-trash-can hidden"></i>
      <i class="${starClass} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories locally, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorite stories locally, generates their HTML, and puts on page. */
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);
  }

  $allStoriesList.show();
}

function putMyStoriesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.prepend($story);

    let $trashcan = $("ol > li > i");
    $trashcan.removeClass("hidden");
  }

  $allStoriesList.show();
}

/** Grabs values from story form and passes those values as an option to addStory method */
async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();

  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  // must await because addStory is async method
  // await will allow the list to update
  const story = await storyList.addStory(currentUser, { author, title, url });
  $storyForm.trigger("reset");

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
}

$storyForm.on("submit", submitNewStory);

//does ID exist in currentUser.favorites
