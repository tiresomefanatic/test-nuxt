---
title: Animation
description: Echo Design System animation dtation
---

<div class="design-layout">
<div class="design-content">

# Animation

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae pharetra rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.

<div class="animation-section">
 <div class="section-heading">
<h2>Style</h2>
</div>
<div class="section-content">
<div class="animation-showcase">
<img src="/images/animation-style.svg" alt="Animation style example" />
</div>
</div>
</div>

<div class="animation-section">
  <div class="section-heading">
    <h2>Scaling</h2>
  </div>
  <div class="section-content">
    <div class="animation-showcase">
      <img src="/images/animation-scaling.svg" alt="Animation scaling example" />
    </div>
  </div>
</div>

<div class="animation-section">
  <div class="section-heading">
    <h2>Slide</h2>
  </div>
  <div class="section-content">
    <div class="animation-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/slide-dark.svg" alt="Slide animation on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/slide-light.svg" alt="Slide animation on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="animation-section">
  <div class="section-heading">
    <h2>Rotation</h2>
  </div>
  <div class="section-content">
    <div class="grid-showcase">
      <div class="grid-examples">
        <div class="grid-item">
          <img src="/images/rotation-1.svg" alt="Rotation example 1" />
          <span>Fig 1.</span>
        </div>
        <div class="grid-item">
          <img src="/images/rotation-2.svg" alt="Rotation example 2" />
          <span>Fig 2.</span>
        </div>
        <div class="grid-item">
          <img src="/images/rotation-3.svg" alt="Rotation example 3" />
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

<div class="animation-section">
  <div class="section-heading">
    <h2>Opacity</h2>
  </div>
  <div class="section-content">
    <div class="animation-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/opacity-dark.svg" alt="Opacity animation on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/opacity-light.svg" alt="Opacity animation on light background" />
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

.animation-section {
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

.animation-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.animation-showcase img {
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

  .animation-section {
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
