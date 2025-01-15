---
title: Design System
description: Echo Design System documentation
---

<div class="design-layout">

<div class="design-content">

# Introduction

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.

<div class="hero-image">
<img src="/images/echo-dna.svg" alt="Echo DNA" />
</div>

## Our Vision

Using the power of our scale, we want to <span class="highlight">democratise electric mobility</span> for the planet.

## Our Mission

Equipping the world with the best in riding tech and <span class="highlight">empowering people</span> to <span class="highlight-blue">make moves that matter</span>, today.

## Our Values

### → Courage

Green mobility should be a global reality. While chasing this ambition with all our technological might. Fuelled to overcome all constraints that might come our way.

### → Honesty

With great products, transparency comes easy. Our riders trust is what drives us to keep raising the bar.

### → Optimism

What good has ever come out a cynic's hat? At VGA, we supercharge intent into action for a better tomorrow.

## Brand Personality

Lorem ipsum dolor sit amet consectetur. Et ut ultrices dolor ut. Vitae gravida rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### → Positive

Green mobility should be a global reality. While chasing this ambition with all our technological might. Fuelled to overcome all constraints that might come our way.

### → Influential

With great products, transparency comes easy. Our riders trust is what drives us to keep raising the bar.

### → Resilient

What good has ever come out a cynic's hat? At VGA, we supercharge intent into action for a better tomorrow.

<div class="card-grid">
<div class="card">
<div class="card-image">
<img src="/images/identity.png" alt="Identity" />
</div>
<h3>Identity</h3>
<p>Lorem ipsum dolor sit amet consectetur, ut amet consectetur.</p>
</div>
<div class="card">
<div class="card-image">
<img src="/images/graphics.png" alt="Graphics" />
</div>
<h3>Graphics</h3>
<p>Lorem ipsum dolor sit amet consectetur, ut amet consectetur.</p>
</div>
<div class="card">
<div class="card-image">
<img src="/images/tone.png" alt="Tone" />
</div>
<h3>Tone</h3>
<p>Lorem ipsum dolor sit amet consectetur, ut amet consectetur.</p>
</div>
<div class="card">
<div class="card-image">
<img src="/images/applications.png" alt="Applications" />
</div>
<h3>Applications</h3>
<p>Lorem ipsum dolor sit amet consectetur, ut amet consectetur.</p>
</div>
</div>

<div class="pagination">
<a href="/" class="prev">Home</a>
<a href="/design/foundation/introduction" class="next">Introduction</a>
</div>

</div>
</div>

<style>
:root {
  --echo-orange: #ff4d00;
  --echo-blue: #4b6bfb;
  --dark-bg: #1c1c1c;
}

.design-layout {
  display: grid;
  grid-template-columns: 228px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.design-sidebar {
  position: sticky;
  top: 0;
  height: fit-content;
}

.design-content {
  min-width: 0;
  padding: 0 2rem;
}

.hero-image {
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 1rem;
  margin: 2.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image img {
  width: 200px;
  height: auto;
}

.highlight {
  color: var(--echo-orange);
  font-weight: 500;
}

.highlight-blue {
  color: var(--echo-blue);
  font-weight: 500;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 3rem 0;
}

.card {
  background: var(--dark-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
}

.card-image {
  width: 100%;
  aspect-ratio: 1;
  background: #000;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: white;
}

.card p {
  margin: 0;
  color: #999;
  font-size: 0.875rem;
  line-height: 1.5;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.pagination a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.pagination a:hover {
  color: var(--echo-orange);
}

.pagination .prev::before {
  content: "←";
  font-size: 1.25rem;
}

.pagination .next::after {
  content: "→";
  font-size: 1.25rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 500;
  margin: 0 0 1.5rem;
  color: var(--dark-bg);
}

h2 {
  font-size: 1.75rem;
  font-weight: 500;
  margin: 2.5rem 0 1rem;
  color: var(--dark-bg);
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 2rem 0 0.75rem;
  color: var(--dark-bg);
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0 0 1rem;
  max-width: 720px;
}
</style>
