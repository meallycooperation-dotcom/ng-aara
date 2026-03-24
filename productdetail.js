// Replace with your Supabase credentials
const SUPABASE_URL = "https://vbabbuqataokwffacmam.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYWJidXFhdGFva3dmZmFjbWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTUxNDIsImV4cCI6MjA4OTc5MTE0Mn0.59-aGoxBI39iInaq_cG2ZbCz_oXqbtKpFepk_LBmdPs";

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const productContainer = document.getElementById("productDetail");

// Get product id from URL query string
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetch product detail
async function fetchProductDetail() {
  const id = getProductId();
  if (!id) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  displayProduct(data);
}

// Display product
function displayProduct(product) {
  const imageUrl = product.image_url
    ? product.image_url
    : "https://picsum.photos/500/400";

// Update breadcrumb with product name

  const breadcrumbSpan = document.getElementById("productNameBreadcrumb");

  if (breadcrumbSpan) {

    breadcrumbSpan.textContent = product.name;

  }

  productContainer.innerHTML = `
    <div class="product-image">
      <img src="${imageUrl}" alt="${product.name}" />
    </div>

    <div class="product-info">
      <h2>${product.name}</h2>
      <p>${product.description || ""}</p>
      <div class="price">KSh ${product.price}</div>
      <div>Stock: ${product.in_stock ? product.stock_count : "Out of Stock"}</div>
      <button ${!product.in_stock ? "disabled" : ""}>
        ${product.in_stock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  `;
}

// Initialize
fetchProductDetail();