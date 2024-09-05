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