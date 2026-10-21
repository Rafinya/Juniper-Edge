/**
 * JUNIPER EDGE - Sanity CMS Client
 * Fetches live content from Sanity using the public GROQ API.
 * Project: 6a0mkfld | Dataset: production
 */

const SANITY_PROJECT_ID = '6a0mkfld';
const SANITY_DATASET    = 'production';
const SANITY_API_VER    = '2023-10-21';
const SANITY_BASE_URL   = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VER}/data/query/${SANITY_DATASET}`;

/**
 * Execute a GROQ query against Sanity's public CDN.
 * @param {string} query - A GROQ query string
 * @returns {Promise<any[]>} Array of result documents
 */
async function sanityFetch(query) {
  const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.warn('[Sanity] Could not fetch data:', err.message);
    return [];
  }
}

/**
 * Build a Sanity image URL from an image asset reference.
 * @param {object} imageRef - Sanity image object with asset._ref
 * @param {number} width - Desired width in px
 * @returns {string} CDN image URL
 */
function sanityImageUrl(imageRef, width = 800) {
  if (!imageRef || !imageRef.asset || !imageRef.asset._ref) return '';
  const ref = imageRef.asset._ref;
  // Format: image-{id}-{dimensions}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}?w=${width}&auto=format`;
}

/* ==========================================================
   TOURS — Fetch all active tours from Sanity
   ========================================================== */
async function fetchToursFromSanity() {
  const query = `*[_type == "tour" && isActive == true] | order(isFeatured desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    badge,
    badgeIcon,
    image,
    shortDescription,
    price,
    priceLabel,
    duration,
    destination,
    highlights,
    itinerary,
    isUpcoming,
    isFeatured,
    inquiryLink
  }`;
  return sanityFetch(query);
}

/* ==========================================================
   JOBS — Fetch all active job listings from Sanity
   ========================================================== */
async function fetchJobsFromSanity() {
  const query = `*[_type == "job" && isActive == true] | order(isUrgent desc, deadline asc) {
    _id,
    title,
    country,
    countryFlag,
    category,
    salary,
    description,
    requirements,
    benefits,
    slots,
    deadline,
    isUrgent
  }`;
  return sanityFetch(query);
}

/* ==========================================================
   RENDER TOURS — Build HTML tour cards from Sanity data
   ========================================================== */
function renderSanityTours(tours, container) {
  if (!container || tours.length === 0) return;

  container.innerHTML = tours.map(tour => {
    const imgUrl   = sanityImageUrl(tour.image, 900);
    const imgAlt   = tour.image?.alt || tour.title;
    const badgeHtml = tour.badge
      ? `<span class="tour-tag" style="background: linear-gradient(135deg,#cf2e2e 0%,#ff5252 100%);color:#fff;font-weight:700;">
           <i class="fa-solid ${tour.badgeIcon || 'fa-star'}" style="margin-right:4px;"></i>${tour.badge}
         </span>`
      : '';

    const priceHtml = tour.price
      ? `<div class="tour-price-badge">
           <span class="price-amount">KES ${tour.price.toLocaleString()}</span>
           <span class="price-label">${tour.priceLabel || 'per person'}</span>
         </div>`
      : '';

    const metaHtml = [
      tour.duration    ? `<span><i class="fa-regular fa-clock"></i> ${tour.duration}</span>` : '',
      tour.destination ? `<span><i class="fa-solid fa-location-dot"></i> ${tour.destination}</span>` : '',
    ].filter(Boolean).join('');

    const highlightsHtml = tour.highlights && tour.highlights.length
      ? `<ul class="tour-highlights-list">
           ${tour.highlights.slice(0, 4).map(h => `<li><i class="fa-solid fa-check" style="color:var(--color-accent);margin-right:6px;"></i>${h}</li>`).join('')}
         </ul>`
      : '';

    const itineraryHtml = tour.itinerary && tour.itinerary.length
      ? `<button class="itinerary-toggle-btn" type="button">View Itinerary <i class="fa-solid fa-chevron-down"></i></button>
         <div class="itinerary-container">
           <div class="itinerary-timeline">
             ${tour.itinerary.map((stop, i) => `
               <div class="itinerary-day">
                 <span class="itinerary-day-num">${i + 1}</span>
                 <div class="itinerary-day-title">${stop.time}: ${stop.title}</div>
                 <div class="itinerary-day-desc">${stop.description || ''}</div>
               </div>`).join('')}
           </div>
         </div>`
      : '';

    const bookLink = tour.inquiryLink
      ? tour.inquiryLink
      : `https://wa.me/254790932804?text=Hi! I'm interested in the "${tour.title}" tour package.`;

    return `
      <div class="tour-card${tour.isUpcoming ? ' upcoming-highlight-card' : ''}" data-filter="${tour.category || 'all'}" data-id="${tour._id}">
        <div class="tour-image">
          ${badgeHtml}
          ${imgUrl ? `<img src="${imgUrl}" alt="${imgAlt}" loading="lazy">` : '<div class="tour-img-placeholder"><i class="fa-solid fa-mountain-sun"></i></div>'}
        </div>
        <div class="tour-body">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
            <h3 style="margin-bottom:0;">${tour.title}</h3>
            ${priceHtml}
          </div>
          ${metaHtml ? `<div class="tour-meta" style="display:flex;gap:1rem;font-size:0.82rem;color:var(--color-text-muted-light);margin-bottom:0.75rem;">${metaHtml}</div>` : ''}
          <p>${tour.shortDescription}</p>
          ${highlightsHtml}
          ${itineraryHtml}
          <div class="tour-footer" style="display:flex;align-items:center;justify-content:space-between;margin-top:1.2rem;flex-wrap:wrap;gap:0.75rem;">
            <a href="${bookLink}" target="_blank" rel="noopener" class="btn btn-primary btn-book-inquiry" style="flex:1;text-align:center;">
              <i class="fa-brands fa-whatsapp" style="margin-right:6px;"></i>Book Inquiry
            </a>
          </div>
        </div>
      </div>`;
  }).join('');

  // Re-attach itinerary toggles for dynamically rendered cards
  container.querySelectorAll('.itinerary-toggle-btn').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const containerEl = toggle.nextElementSibling;
      toggle.classList.toggle('active');
      containerEl.classList.toggle('active');
      toggle.innerHTML = toggle.classList.contains('active')
        ? 'Hide Itinerary <i class="fa-solid fa-chevron-up"></i>'
        : 'View Itinerary <i class="fa-solid fa-chevron-down"></i>';
    });
  });
}

/* ==========================================================
   RENDER JOBS — Build HTML job cards from Sanity data
   ========================================================== */
function renderSanityJobs(jobs, container) {
  if (!container || jobs.length === 0) return;

  const continentMap = {
    canada: 'north-america',
    luxembourg: 'europe', turkey: 'europe',
    uae: 'middle-east-asia', qatar: 'middle-east-asia', saudi: 'middle-east-asia', oman: 'middle-east-asia',
    mauritius: 'africa',
  };

  container.innerHTML = jobs.map(job => {
    const flag = job.countryFlag || '';
    const continent = continentMap[job.country] || 'all';
    const requirementsHtml = job.requirements && job.requirements.length
      ? `<div class="job-requirements">
           ${job.requirements.map(r => `<span class="req-tag">${r}</span>`).join('')}
         </div>`
      : '';
    const benefitsHtml = job.benefits && job.benefits.length
      ? `<ul class="job-benefits" style="margin:0.5rem 0 0;padding-left:1.2rem;font-size:0.85rem;color:var(--color-text-muted-light);">
           ${job.benefits.slice(0, 3).map(b => `<li>${b}</li>`).join('')}
         </ul>`
      : '';

    return `
      <div class="job-card" data-country="${job.country}" data-category="${job.category || 'skilled'}" data-continent="${continent}">
        <div class="job-header">
          <div class="job-flag">${flag}</div>
          <div class="job-info">
            <h3>${job.title}${job.isUrgent ? ' <span class="urgent-badge">Urgent</span>' : ''}</h3>
            <div class="job-meta">
              <span><i class="fa-solid fa-location-dot"></i> ${job.country ? job.country.charAt(0).toUpperCase() + job.country.slice(1) : ''}</span>
              ${job.salary ? `<span><i class="fa-solid fa-money-bill-wave"></i> ${job.salary}</span>` : ''}
              ${job.slots ? `<span><i class="fa-solid fa-users"></i> ${job.slots} Slots</span>` : ''}
            </div>
          </div>
        </div>
        ${job.description ? `<p class="job-description">${job.description}</p>` : ''}
        ${requirementsHtml}
        ${benefitsHtml}
        <div class="job-footer" style="margin-top:1rem;">
          <button class="btn btn-job-connect open-apply-modal" data-job-title="${job.title}">
            <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i>Apply Now
          </button>
        </div>
      </div>`;
  }).join('');

  // Re-attach apply modal triggers for dynamic cards
  container.querySelectorAll('.open-apply-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobTitle = btn.getAttribute('data-job-title');
      const modal = document.getElementById('apply-modal');
      const titleInput = document.getElementById('modal-job-title');
      const titleHeading = document.getElementById('apply-job-title-heading');
      if (modal) {
        modal.classList.add('active');
        if (titleInput) titleInput.value = jobTitle;
        if (titleHeading) titleHeading.textContent = jobTitle;
      }
    });
  });
}

/* ==========================================================
   INIT — Called by main.js on DOMContentLoaded
   ========================================================== */
async function initSanityContent() {
  // ---- TOURS PAGE ----
  const toursGrid = document.getElementById('explorer-tours-grid');
  if (toursGrid) {
    const tours = await fetchToursFromSanity();
    if (tours && tours.length > 0) {
      renderSanityTours(tours, toursGrid);
    }
    // If no tours in Sanity yet, the existing HTML fallback stays active seamlessly
  }

  // ---- CAREERS PAGE ----
  const jobsGrid = document.querySelector('.jobs-grid');
  if (jobsGrid) {
    const jobs = await fetchJobsFromSanity();
    if (jobs.length > 0) {
      renderSanityJobs(jobs, jobsGrid);
    }
    // If no jobs in Sanity, keep existing hardcoded HTML
  }
}

// Export for use in main.js or direct script include
window.JuniperSanity = { initSanityContent, fetchToursFromSanity, fetchJobsFromSanity, sanityImageUrl };

