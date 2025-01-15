---
title: Applications
description: Echo Design System application guidel
---

<div class="design-layout">
<div class="design-sidebar">
<design-sidebar />
</div>

<div class="design-content">

# Applications

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae pharetra rutrum dolor vestibulum pharetra et. Pretiumnsectetur venenatis lacus quam dolor lacinia.

<div class="applications-section">
  <div class="section-heading">
    <h2>Letterhead</h2>
  </div>
  <div class="section-content">
    <div class="application-showcase">
      <img src="/images/letterhead.svg" alt="Letterhead example" />
    </div>
  </div>
</div>

<div class="applications-section">
  <div class="section-heading">
    <h2>Envelopes</h2>
  </div>
  <div class="section-content">
    <div class="application-showcase">
      <img src="/images/envelopes.svg" alt="Envelopes example" />
    </div>
  </div>
</div>

<div class="applications-section">
  <div class="section-heading">
    <h2>Business cards</h2>
  </div>
  <div class="section-content">
    <div class="application-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/business-cards-dark.svg" alt="Business cards on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/business-cards-light.svg" alt="Business cards on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="applications-section">
  <div class="section-heading">
    <h2>Bag tags</h2>
  </div>
  <div class="section-content">
    <div class="grid-showcase">
      <div class="grid-examples">
        <div class="grid-item">
          <img src="/images/bag-tag-1.svg" alt="Bag tag example 1" />
          <span>Fig 1.</span>
        </div>
        <div class="grid-item">
          <img src="/images/bag-tag-2.svg" alt="Bag tag example 2" />
          <span>Fig 2.</span>
        </div>
        <div class="grid-item">
          <img src="/images/bag-tag-3.svg" alt="Bag tag example 3" />
          <span>Fig 3.</span>
        </div>
      </div>
      <div class="grid-notes">
        <p>Fig 1. Do not change the ratio between the VIDA zip and the VIDA wordmark</p>
        <p>Fig 2. Do not tilt the logo (unless under certain exceptions and circumstances)</p>
        <p>Fig 3. Do not outline the VIDA Logo</p>
      </div>
    </div>
  </div>
</div>

<div class="applications-section">
  <div class="section-heading">
    <h2>Lanyards</h2>
  </div>
  <div class="section-content">
    <div class="application-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/lanyards-dark.svg" alt="Lanyards on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/lanyards-light.svg" alt="Lanyards on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

</div>
</div>

<style>
.design-layout {
  display: flex;
  gap: 2rem;
}

.design-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.design-content {
  flex: 1;
  max-width: 800px;
}

.applications-section {
  display: flex;
  gap: 2rem;
  margin: 3rem 0;
}

.section-heading {
  flex: 1;
}

.section-heading h2 {
  margin: 0;
}

.section-content {
  flex: 2;
}

.application-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.application-showcase img {
  width: 100%;
  height: auto;
  display: block;
}

.split-showcase {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.dark-bg {
  background: #000;
  padding: 2rem;
  border-radius: 4px;
}

.light-bg {
  background: #fff;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

.grid-examples {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.grid-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.grid-item img {
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
}

.grid-item span {
  font-size: 0.9rem;
  color: #666;
}

.grid-notes {
  color: #666;
  font-size: 0.9rem;
}

.grid-notes p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
  
  .design-sidebar {
    width: 100%;
  }

  .applications-section {
    flex-direction: column;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .split-showcase {
    grid-template-columns: 1fr;
  }

  .grid-examples {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
