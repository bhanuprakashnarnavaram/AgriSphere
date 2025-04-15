document.addEventListener("DOMContentLoaded", () => {
    const vegetableForm = document.getElementById("vegetableForm");
    const vegetableList = document.getElementById("vegetableList");

    async function fetchListings() {
        const response = await fetch("http://localhost:5000/listings");
        const vegetables = await response.json();

        vegetableList.innerHTML = "";
        vegetables.forEach((veg) => {
            const photos = JSON.parse(veg.images || "[]");

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${photos.length > 0 ? photos.map(photo => `<img src="http://localhost:5000/uploads/${photo}" width="50">`).join(" ") : "No Image"}</td>
                <td>${veg.name}</td>
                <td>${veg.description}</td>
                <td>₹${veg.price} per kg</td>
                <td>${veg.contact}</td>
                <td><a href="${veg.mapLink}" target="_blank">Location</a></td>
                <td>
                    <button onclick="editItem(${veg.id})">Edit</button>
                    <button onclick="deleteItem(${veg.id})">Delete</button>
                </td>
            `;
            vegetableList.appendChild(row);
        });
    }

    vegetableForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(vegetableForm);
        let vegId = document.getElementById("vegId").value;

        let url = "http://localhost:5000/add";
        let method = "POST";

        if (vegId) {
            url = `http://localhost:5000/update/${vegId}`;
            method = "PUT";
        }

        await fetch(url, { method, body: formData });

        vegetableForm.reset();
        document.getElementById("vegId").value = "";
        fetchListings();
    });

    async function deleteItem(id) {
        if (confirm("Are you sure you want to delete this listing?")) {
            await fetch(`http://localhost:5000/delete/${id}`, { method: "DELETE" });
            fetchListings();
        }
    }

    async function editItem(id) {
        const response = await fetch(`http://localhost:5000/listing/${id}`);
        const listing = await response.json();

        document.getElementById("vegId").value = listing.id;
        document.getElementById("vegName").value = listing.name;
        document.getElementById("description").value = listing.description;
        document.getElementById("price").value = listing.price;
        document.getElementById("contact").value = listing.contact;
        document.getElementById("mapLink").value = listing.mapLink;
    }

    window.deleteItem = deleteItem;
    window.editItem = editItem;

    fetchListings();
});
