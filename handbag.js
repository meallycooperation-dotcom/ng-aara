// Replace with your Supabase credentials
const SUPABASE_URL = "https://vbabbuqataokwffacmam.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYWJidXFhdGFva3dmZmFjbWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTUxNDIsImV4cCI6MjA4OTc5MTE0Mn0.59-aGoxBI39iInaq_cG2ZbCz_oXqbtKpFepk_LBmdPs";

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("search");

// Fetch handbag products
async function fetchHandbags() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("category", "handbags")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading products.</p>";
    return;
  }

  displayProducts(data);
}

// Display products
function displayProducts(products) {
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p>No handbags found</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const imageUrl = product.image_url
      ? product.image_url
      : "https://picsum.photos/400/300";

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${imageUrl}" />
      <div class="product-content">
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>
        <div class="price">KSh ${product.price}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `productdetail.html?id=${product.id}`;
    });

    container.appendChild(card);
  });
}

// Search filter
searchInput.addEventListener("input", async () => {
  const value = searchInput.value.toLowerCase();

  const { data } = await supabaseClient
    .from("products")
    .select("*")
    .eq("category", "handbags")
    .ilike("name", `%${value}%`);

  displayProducts(data);
});

// Initialize
fetchHandbags();