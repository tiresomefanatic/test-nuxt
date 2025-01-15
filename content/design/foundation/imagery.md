---
title: Imagery
description: Echo Design System imagery docution
---

<div class="design-layout">
<div class="design-content">

# Imagery

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor u Vitae pharetra rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.

<div class="imagery-section">
  <div class="section-heading">
    <h2>Mood/Style/Tone</h2>
  </div>
  <div class="section-content">
    <div class="imagery-showcase">
      <img src="/images/mood-style-tone.svg" alt="Mood, style and tone example" />
    </div>
  </div>
</div>

<div class="imagery-section">
  <div class="section-heading">
    <h2>Attitude and people</h2>
  </div>
  <div class="section-content">
    <div class="imagery-showcase">
      <img src="/images/attitude-people.svg" alt="Attitude and people imagery" />
    </div>
  </div>
</div>

<div class="imagery-section">
  <div class="section-heading">
    <h2>Places</h2>
  </div>
  <div class="section-content">
    <div class="imagery-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/places-dark.svg" alt="Places imagery on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/places-light.svg" alt="Places imagery on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="imagery-section">
  <div class="section-heading">
    <h2>Colors</h2>
  </div>
  <div class="section-content">
    <div class="grid-showcase">
      <div class="grid-examples">
        <div class="grid-item">
          <img src="/images/color-1.svg" alt="Color example 1" />
          <span>Fig 1.</span>
        </div>
        <div class="grid-item">
          <img src="/images/color-2.svg" alt="Color example 2" />
          <span>Fig 2.</span>
        </div>
        <div class="grid-item">
          <img src="/images/color-3.svg" alt="Color example 3" />
          <span>Fig 3.</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="imagery-section">
  <div class="section-heading">
    <h2>Lighting</h2>
  </div>
  <div class="section-content">
    <div class="imagery-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/lighting-dark.svg" alt="Lighting on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/lighting-light.svg" alt="Lighting on light background" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="imagery-section">
  <div class="section-heading">
    <h2>Perspective</h2>
  </div>
  <div class="section-content">
    <div class="imagery-showcase">
      <div class="split-showcase">
        <div class="dark-bg">
          <img src="/images/perspective-dark.svg" alt="Perspective on dark background" />
        </div>
        <div class="light-bg">
          <img src="/images/perspective-light.svg" alt="Perspective on light background" />
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

.design-content {
  flex: 1;
  max-width: 800px;
}

.imagery-section {
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

.imagery-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.imagery-showcase img {
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

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
  
  .imagery-section {
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
