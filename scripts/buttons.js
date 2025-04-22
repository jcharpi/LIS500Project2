document.addEventListener("DOMContentLoaded", () => {
    const innerTabs = document.querySelectorAll(".inner-tab-link");
    const innerContents = document.querySelectorAll(".inner-tab-content");

    innerTabs.forEach(tab => {
        tab.addEventListener("click", event => {
            event.preventDefault();
            const targetTab = tab.getAttribute("data-tab");

            innerTabs.forEach(t => t.classList.remove("active"));
            innerContents.forEach(content => content.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });
});