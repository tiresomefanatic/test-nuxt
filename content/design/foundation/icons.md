---
title: Icons
description: Echo Design System icons documentation
---

<div class="design-layout">
<div class="design-content">

# Icons

Lorem ipsum dolor sit amet consectetur. Et ut ultric ut. Vitae pharetra rutrum dolor vestibulum pharetra et. Pretium consecttur venenatis lacus quam dolor lacinia.

<div class="icon-section">
  <div class="section-heading">
    <h2>Style and structure</h2>
  </div>
  <div class="section-content">
    <div class="icon-showcase">
      <img src="/images/vida-logo-structure.svg" alt="VIDA logo structure and style" />
    </div>
  </div>
</div>

<div class="icon-section">
  <div class="section-heading">
    <h2>Size</h2>
  </div>
  <div class="section-content">
    <div class="icon-showcase size">
      <img src="/images/vida-logo-size.svg" alt="VIDA logo size guidelines" />
    </div>
  </div>
</div>

<div class="icon-section">
  <div class="section-heading">
    <h2>Spacing</h2>
  </div>
  <div class="section-content">
    <div class="icon-showcase spacing">
      <div class="spacing-grid">
        <div class="dark-bg">
          <img src="/images/vida-logo-dark.svg" alt="VIDA logo on dark background" />
          <img src="/images/vida-logo-dark-horizontal.svg" alt="VIDA horizontal logo on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/vida-logo-light.svg" alt="VIDA logo on light background" />
          <img src="/images/vida-logo-light-horizontal.svg" alt="VIDA horizontal logo on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="icon-section">
  <div class="section-heading">
    <h2>Usage</h2>
  </div>
  <div class="section-content">
    <div class="usage-grid">
      <div class="usage-example">
        <img src="/images/usage-1.svg" alt="Usage example 1" />
        <span>Fig 1.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-2.svg" alt="Usage example 2" />
        <span>Fig 2.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-3.svg" alt="Usage example 3" />
        <span>Fig 3.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-4.svg" alt="Usage example 4" />
        <span>Fig 4.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-5.svg" alt="Usage example 5" />
        <span>Fig 5.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-6.svg" alt="Usage example 6" />
        <span>Fig 6.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-7.svg" alt="Usage example 7" />
        <span>Fig 7.</span>
      </div>
      <div class="usage-example">
        <img src="/images/usage-8.svg" alt="Usage example 8" />
        <span>Fig 8.</span>
      </div>
    </div>
    <div class="usage-notes">
      <p>Fig 1. Do not change the ratio between the VIDA zip and the VIDA wordmark</p>
      <p>Fig 2. Do not tilt the logo (unless under certain exceptions and circumstances)</p>
      <p>Fig 3. Do not outline the VIDA Logo</p>
      <p>Fig 4. Do not use the VIDA Zip as a typographical substitute under any circumstance</p>
      <p>Fig 5. Do not skew or stretch the VIDA logo in any way or form</p>
      <p>Fig 6. Do not apply any special effects to the logo (unless under certain exceptions and circumstances)</p>
      <p>Fig 7. Do not alter the spacing inbetween the VIDA wordmark</p>
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

.icon-section {
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

.icon-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.icon-showcase img {
  width: 100%;
  height: auto;
  display: block;
}

.spacing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.dark-bg {
  background: #000;
  padding: 2rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.light-bg {
  background: #fff;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.usage-example {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.usage-example img {
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
}

.usage-example span {
  font-size: 0.9rem;
  color: #666;
}

.usage-notes {
  color: #666;
  font-size: 0.9rem;
}

.usage-notes p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
  
  .design-sidebar {
    width: 100%;
  }

  .icon-section {
    flex-direction: column;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .spacing-grid {
    grid-template-columns: 1fr;
  }

  .usage-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
