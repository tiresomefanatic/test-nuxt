---
title: Illustration
description: Echo Design System illustration documentation
---

<div class="design-layout">
<div class="design-content">

# Illustration

Lorem ipsum dolor sit amet consectetur. Et ultrices dolor ut. Vitae pharetra rutrum dolor vestibulum pharetra et. Pretium consectetur venenatis lacus quam dolor lacinia.

<div class="illustration-section">
  <div class="section-heading">
    <h2>Style</h2>
  </div>
<div class="section-content">
    <div class="style-grid">
      <img src="/images/illustration-style-1.svg" alt="Pen illustration" />
      <img src="/images/illustration-style-2.svg" alt="Charger illustration" />
      <img src="/images/illustration-style-3.svg" alt="Camera mount illustration" />
      <img src="/images/illustration-style-4.svg" alt="Scooter illustration" />
      <img src="/images/illustration-style-5.svg" alt="Device illustration" />
      <img src="/images/illustration-style-6.svg" alt="Business card illustration" />
      <img src="/images/illustration-style-7.svg" alt="Package illustration" />
      <img src="/images/illustration-style-8.svg" alt="Product illustration" />
    </div>
    <p class="style-description">VIDA has a very strong illustration language. Generally the rule of thumb is, make sure to use flat drawings usually in an orthographic front view for the best angle to best convey the object being illustrated with no more than 4-5 colours and shades. Keep the illustrations simple, marking only the important details.</p>
  </div>
</div>

<div class="illustration-section">
  <div class="section-heading">
    <h2>Brand illustration</h2>
  </div>
  <div class="section-content">
    <div class="illustration-showcase">
      <img src="/images/brand-illustration.svg" alt="Brand illustration example" />
    </div>
  </div>
</div>

<div class="illustration-section">
  <div class="section-heading">
    <h2>Product illustration</h2>
  </div>
  <div class="section-content">
    <div class="illustration-showcase">
      <img src="/images/product-illustration.svg" alt="Product illustration example" />
    </div>
  </div>
</div>
<div class="illustration-section">
  <div class="section-heading">
    <h2>Mascot illustration</h2>
  </div>
  <div class="section-content">
    <div class="illustration-showcase">
      <img src="/images/mascot-illustration.svg" alt="Mascot illustration example" />
    </div>
  </div>
</div>

<div class="illustration-section">
  <div class="section-heading">
    <h2>Explorative illustrations</h2>
  </div>
  <div class="section-content">
    <div class="illustration-showcase">
      <img src="/images/explorative-illustration.svg" alt="Explorative illustration example" />
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

.illustration-section {
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

.style-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.style-grid img {
  width: 100%;
  height: auto;
  display: block;
}

.style-description {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.illustration-showcase {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 4px;
}

.illustration-showcase img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .design-layout {
    flex-direction: column;
  }
  
  .design-sidebar {
    width: 100%;
  }

  .illustration-section {
    flex-direction: column;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
