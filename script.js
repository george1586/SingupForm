const sidebar = document.querySelector(".sidebar");
const elements = document.querySelectorAll('.hideOnPhone');

function showSideBar() {
    sidebar.style.display = "flex";
    elements.forEach(function (elements) {
        elements.classList.add('hidden');
    });
}

function hideSideBar() {
    sidebar.style.display = "none";
    elements.forEach(function (elements) {
        elements.classList.remove('hidden');
    });
}
const headings = document.querySelectorAll("h3");
const listItems = document.querySelectorAll("aside ul#table li");
const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      listItems.forEach((item) => {
        item.style.backgroundColor = "";
        item.style.borderColor="rgb(209 213 219)";
      });
      const id = entry.target.id;
      const activeListItem = document.querySelector(`aside ul#table li a[href="#${id}"]`);
      if (activeListItem) {
        activeListItem.parentElement.style.backgroundColor = "rgb(107, 114, 128, .1)";
        activeListItem.parentElement.style.borderColor="rgb(107 114 128 )";
      }
    }
  });
};

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
headings.forEach((heading) => observer.observe(heading));
