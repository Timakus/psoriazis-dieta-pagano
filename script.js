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

function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
}

window.addEventListener("scroll", function () {
    const button = document.getElementById("backToTop");
    if (button) {
      if (window.pageYOffset > 300) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    }
});

// FAQ ФУНКЦИОНАЛНОСТ
function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const arrow = button.querySelector('.faq-arrow');
    
    // Затвори други отворени FAQ
    document.querySelectorAll('.faq-answer.open').forEach(item => {
        if (item !== answer) {
            item.classList.remove('open');
            item.previousElementSibling.classList.remove('active');
            item.previousElementSibling.querySelector('.faq-arrow').classList.remove('rotated');
        }
    });
    
    // Toggle текущия FAQ
    answer.classList.toggle('open');
    button.classList.toggle('active');
    arrow.classList.toggle('rotated');
}

// АВТОМАТИЧНО ГЕНЕРИРАНЕ НА FAQ SCHEMA
function generateSchemaFromHTML() {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;
    
    const faqItems = faqSection.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    const mainEntity = [];
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span:first-child');
        const answer = item.querySelector('.faq-answer p');
        
        if (question && answer) {
            mainEntity.push({
                "@type": "Question",
                "name": question.textContent.trim(),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer.textContent.trim()
                }
            });
        }
    });
    
    if (mainEntity.length > 0) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": mainEntity
        };
        
        // Създай или обнови schema script tag
        let schemaScript = document.getElementById('faq-schema');
        if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            schemaScript.id = 'faq-schema';
            document.head.appendChild(schemaScript);
        }
        
        schemaScript.textContent = JSON.stringify(schema, null, 2);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Съществуващ код за сортиране на таблици
    document.querySelectorAll(".product-table tbody").forEach((tbody) => {
        if (tbody.closest(".supplements")) {
            return;
        }
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const productRows = rows.filter((row) => {
            const firstCell = row.querySelector("td");
            return firstCell && !firstCell.hasAttribute("colspan");
        });
        productRows.sort((a, b) => {
            const nameA = a.querySelector("td").textContent.trim().toLowerCase();
            const nameB = b.querySelector("td").textContent.trim().toLowerCase();
            return nameA.localeCompare(nameB, "bg");
        });
        productRows.forEach((row) => tbody.appendChild(row));
    });

    // ПОПРАВЕН ТОС КОД
    const tocList = document.getElementById('toc-list');
    if (tocList) {
        const headings = document.querySelectorAll('.product-section h2, .product-section h3');
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            if (heading.tagName === 'H3') {
                li.style.marginLeft = '20px';
                li.style.fontSize = '0.95rem';
            }
            li.appendChild(a);
            tocList.appendChild(li);
        });
        
        const toc = document.querySelector('.table-of-contents');
        const tocTitle = toc.querySelector('h3');
        tocTitle.innerHTML = '📖 Съдържание';
        
        // Създаваме само един readMore бутон
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'toc-read-more';
        readMoreBtn.textContent = 'Прочети цялото съдържание';
        tocTitle.parentNode.insertBefore(readMoreBtn, tocList);
        
        // Създаваме само един hide бутон
        const hideBtn = document.createElement('button');
        hideBtn.className = 'toc-hide';
        hideBtn.textContent = 'Скрий съдържанието';
        hideBtn.style.display = 'none';
        tocTitle.parentNode.insertBefore(hideBtn, tocList.nextSibling);
        
        // Скриваме TOC по подразбиране
        tocList.style.maxHeight = '0';
        tocList.style.overflow = 'hidden';
        tocList.style.opacity = '0';
        tocList.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
        
        // САМО ЕДИН addEventListener за readMore
        readMoreBtn.addEventListener('click', function() {
            tocList.style.maxHeight = tocList.scrollHeight + 'px';
            tocList.style.opacity = '1';
            readMoreBtn.style.display = 'none';  // Скрий readMore
            hideBtn.style.display = 'block';     // Покажи hide
        });
        
        // САМО ЕДИН addEventListener за hide  
        hideBtn.addEventListener('click', function() {
            tocList.style.maxHeight = '0';
            tocList.style.opacity = '0';
            hideBtn.style.display = 'none';      // Скрий hide
            readMoreBtn.style.display = 'block'; // Покажи readMore
        });
    }
    
    // НОВО - генериране на FAQ schema
    generateSchemaFromHTML();
});