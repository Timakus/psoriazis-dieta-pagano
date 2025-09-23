function toggleCategory(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector(".arrow");

    document
      .querySelectorAll(".category-content.open")
      .forEach((openContent) => {
        if (openContent !== content) {
          openContent.classList.remove("open");
          openContent.previousElementSibling
            .querySelector(".arrow")
            .classList.remove("open");
        }
      });

    content.classList.toggle("open");
    arrow.classList.toggle("open");
    
    // Спри автоматичния скрол
    event.preventDefault();
        history.replaceState(null, null, window.location.pathname);
}

function switchTab(tabName) {
    document
      .querySelectorAll(".category-content.open")
      .forEach((content) => {
        content.classList.remove("open");
        content.previousElementSibling
          .querySelector(".arrow")
          .classList.remove("open");
      });

    document
      .querySelectorAll(".tab-button")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    event.target.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".product-table tbody").forEach((tbody) => {
      // Изключи supplements таблиците от сортирането
      if (tbody.closest(".supplements")) {
        return;
      }

      const rows = Array.from(tbody.querySelectorAll("tr"));

      const productRows = rows.filter((row) => {
        const firstCell = row.querySelector("td");
        return firstCell && !firstCell.hasAttribute("colspan");
      });

      productRows.sort((a, b) => {
        const nameA = a
          .querySelector("td")
          .textContent.trim()
          .toLowerCase();
        const nameB = b
          .querySelector("td")
          .textContent.trim()
          .toLowerCase();
        return nameA.localeCompare(nameB, "bg");
      });

      productRows.forEach((row) => tbody.appendChild(row));
    });
});

function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
}

window.addEventListener("scroll", function () {
    const button = document.getElementById("backToTop"); // Върни на backToTop
    if (button) {
      if (window.pageYOffset > 300) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tocList = document.getElementById('toc-list');
    
    if (tocList) {
        const headings = document.querySelectorAll('.product-section h2, .product-section h3');
        
        headings.forEach((heading, index) => {
            // Добави ID ако няма
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            
            // Добави indent за H3
            if (heading.tagName === 'H3') {
                li.style.marginLeft = '20px';
                li.style.fontSize = '0.95rem';
            }
            
            li.appendChild(a);
            tocList.appendChild(li);
        });
        
        // Акордеон функционалност
        const toc = document.querySelector('.table-of-contents');
        const tocTitle = toc.querySelector('h3');
        
        // Промени текста на заглавието
        tocTitle.innerHTML = '📑 Съдържание';
        
        // Създай "read more" бутон
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'toc-read-more';
        readMoreBtn.textContent = 'Прочети цялото съдържание';
        tocTitle.parentNode.insertBefore(readMoreBtn, tocList);
        
        // Създай "hide" бутон (скрит по подразбиране)
        const hideBtn = document.createElement('button');
        hideBtn.className = 'toc-hide';
        hideBtn.textContent = 'Скрий съдържанието';
        hideBtn.style.display = 'none';
        tocList.parentNode.insertBefore(hideBtn, tocList.nextSibling);
        
        // Скрий списъка по подразбиране
        tocList.style.maxHeight = '0';
        tocList.style.overflow = 'hidden';
        tocList.style.opacity = '0';
        tocList.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
        
        // Toggle функция за "read more"
        readMoreBtn.addEventListener('click', function() {
            tocList.style.maxHeight = tocList.scrollHeight + 'px';
            tocList.style.opacity = '1';
            this.style.display = 'none';
            hideBtn.style.display = 'block';
        });
        
        // Toggle функция за "hide"
        hideBtn.addEventListener('click', function() {
            tocList.style.maxHeight = '0';
            tocList.style.opacity = '0';
            this.style.display = 'none';
            readMoreBtn.style.display = 'block';
        });
    }
});