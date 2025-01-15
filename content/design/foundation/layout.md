---
title: Layout
description: Echo Design System layout
---

<div class="design-layout">
<div class="design-content">

# Layout

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae pharetra rutrum dolor vestibulum pharetra et. Pretium coctetur venenatis lacus quam dolor lacinia.

<div class="layout-section">
  <div class="section-heading">
    <h2>Style and structure</h2>
  </div>
  <div class="section-content">
    <div class="layout-showcase">
      <img src="/images/layout-structure.svg" alt="Layout style and structure example" />
    </div>
  </div>
</div>

<div class="layout-section">
  <div class="section-heading">
    <h2>Presentation grid</h2>
  </div>
  <div class="section-content">
    <div class="layout-showcase">
      <img src="/images/presentation-grid.svg" alt="Presentation grid system" />
    </div>
  </div>
</div>

<div class="layout-section">
  <div class="section-heading">
    <h2>A4 grids</h2>
  </div>
  <div class="section-content">
    <div class="grid-showcase">
      <div class="dark-bg">
        <img src="/images/a4-grid-dark-1.svg" alt="A4 grid dark version 1" />
        <img src="/images/a4-grid-dark-2.svg" alt="A4 grid dark version 2" />
      </div>
      <div class="light-bg">
        <img src="/images/a4-grid-light-1.svg" alt="A4 grid light version 1" />
        <img src="/images/a4-grid-light-2.svg" alt="A4 grid light version 2" />
      </div>
    </div>
  </div>
</div>

<div class="layout-section">
  <div class="section-heading">
    <h2>Branding grids</h2>
  </div>
  <div class="section-content">
    <div class="branding-grid">
      <div class="grid-examples">
        <div class="grid-item">
          <img src="/images/brand-grid-1.svg" alt="Brand grid example 1" />
          <span>Fig 1.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-2.svg" alt="Brand grid example 2" />
          <span>Fig 2.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-3.svg" alt="Brand grid example 3" />
          <span>Fig 3.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-4.svg" alt="Brand grid example 4" />
          <span>Fig 4.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-5.svg" alt="Brand grid example 5" />
          <span>Fig 5.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-6.svg" alt="Brand grid example 6" />
          <span>Fig 6.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-7.svg" alt="Brand grid example 7" />
          <span>Fig 7.</span>
        </div>
        <div class="grid-item">
          <img src="/images/brand-grid-8.svg" alt="Brand grid example 8" />
          <span>Fig 8.</span>
        </div>
      </div>
      <div class="grid-notes">
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
</div>

<style>
.design-layout {
  display: flex;
  gap: 2rem;
}

.design-content {
  flex: 1;
  max-width: 800px;
}

.layout-section {
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

.layout-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.layout-showcase img {
  width: 100%;
  height: auto;
  display: block;
}

.grid-showcase {
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

.dark-bg img,
.light-bg img {
  width: 100%;
  height: auto;
  display: block;
}

.branding-grid {
  margin-top: 1rem;
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
  
  .layout-section {
    flex-direction: column;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .grid-showcase {
    grid-template-columns: 1fr;
  }

  .grid-examples {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
