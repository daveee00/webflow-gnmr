document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const linkTree = document.querySelector("#link-tree");
  
  if (!scrollIndicator) return;
  
  // Initially hide the link-tree
  if (linkTree) {
    linkTree.style.opacity = "0";
    linkTree.style.transition = "opacity 0.5s ease-in-out";
  }

  // Fade out the indicator when user starts scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIndicator.classList.add("fade-out");
      // Fade in the link-tree when indicator fades out
      if (linkTree) {
        linkTree.style.opacity = "1";
      }
    } else {
      scrollIndicator.classList.remove("fade-out");
      // Hide the link-tree when indicator is visible
      if (linkTree) {
        linkTree.style.opacity = "0";
      }
    }
  });
});
