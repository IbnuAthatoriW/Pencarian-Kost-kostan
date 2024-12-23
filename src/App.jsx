import React, { useState, useEffect } from "react";

const App = () => {
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [searchMethod, setSearchMethod] = useState("iterative");
  const [runtime, setRuntime] = useState(null);
  const [averageOperationTime, setAverageOperationTime] = useState(null);
  const [dataSize, setDataSize] = useState(1000);

  useEffect(() => {
    setLocations([
      "Antapani", "Arcamanik", "Astana Anyar", "Babakan Ciparay", "Bandung Kulon",
      "Bandung Wetan", "Batununggal", "Bojongloa Kaler", "Bojongloa Kidul", "Buahbatu",
      "Cibeunying Kaler", "Cibeunying Kidul", "Cicendo", "Cidadap", "Cinambo",
      "Coblong", "Gedebage", "Kiaracondong", "Lengkong", "Mandalajati", "Panyileukan",
      "Rancasari", "Regol", "Sukajadi", "Sukasari", "Sumur Bandung", "Ujungberung",
    ]);
    setSpecifications(["AC", "WiFi", "Parkir Motor", "Kamar Mandi Dalam"]);
    setBudgets([1000000, 1500000, 2000000, 2500000, 3000000]);
  }, []);

  const generateData = (size) => {
    return Array.from({ length: size }, (_, i) => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomSpecs = specifications
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * specifications.length) + 1);

      return {
        name: `Kost Bandung ${i + 1}`,
        price: 1000000 + Math.floor(Math.random() * 2000000),
        location: randomLocation,
        specs: randomSpecs.join(", "),
      };
    });
  };

  const [sampleResults, setSampleResults] = useState(generateData(dataSize));

  useEffect(() => {
    setSampleResults(generateData(dataSize));
  }, [dataSize]);

  const iterativeSearch = (kostList) => {
    console.time("iterative");
    let operationTime = 0;

    const result = kostList.filter((kost) => {
      const startOperation = performance.now();
      const matches = budget === "" || kost.price <= parseInt(budget);
      operationTime += performance.now() - startOperation;
      return matches;
    });

    console.timeEnd("iterative");
    setAverageOperationTime(`Rata-rata waktu per operasi (Iteratif): ${(operationTime / kostList.length).toFixed(4)} ms`);
    return result;
  };

  const recursiveSearch = (kostList, index = 0, filteredResults = [], operationTime = { total: 0 }) => {
    if (index >= kostList.length) {
      setAverageOperationTime(`Rata-rata waktu per operasi (Rekursif): ${(operationTime.total / kostList.length).toFixed(4)} ms`);
      return filteredResults;
    }

    const startOperation = performance.now();
    const kost = kostList[index];
    if (budget === "" || kost.price <= parseInt(budget)) {
      filteredResults.push(kost);
    }
    operationTime.total += performance.now() - startOperation;

    return recursiveSearch(kostList, index + 1, filteredResults, operationTime);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    let filteredResults = [];
    const startTime = performance.now();

    if (searchMethod === "iterative") {
      filteredResults = iterativeSearch(sampleResults);
    } else if (searchMethod === "recursive") {
      filteredResults = recursiveSearch(sampleResults);
    }

    const endTime = performance.now();
    setRuntime(`Waktu pencarian: ${(endTime - startTime).toFixed(2)} ms`);
    setResults(filteredResults);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Pencarian Kost - Bandung</h1>
      </header>

      <main className="container mx-auto p-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cari Kost</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget (Rp)</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Budget</option>
                {budgets.map((option, index) => (
                  <option key={index} value={option}>
                    {option.toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Metode Pencarian</label>
              <select
                value={searchMethod}
                onChange={(e) => setSearchMethod(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="iterative">Iteratif</option>
                <option value="recursive">Rekursif</option>
              </select>
            </div>

            {/* Data Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Data</label>
              <select
                value={dataSize}
                onChange={(e) => setDataSize(Number(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={100}>100</option>
                <option value={1000}>1000</option>
                <option value={2500}>2500</option>
                <option value={5000}>5000</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="col-span-full text-center">
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
              >
                Cari
              </button>
            </div>
          </form>
        </section>

        {/* Display Search Runtime */}
        {runtime && (
          <section className="mt-4 text-center">
            <p className="text-lg text-green-500">{runtime}</p>
          </section>
        )}

        {/* Display Average Operation Time */}
        {averageOperationTime && (
          <section className="mt-4 text-center">
            <p className="text-lg text-blue-500">{averageOperationTime}</p>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Hasil Pencarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.length > 0 ? (
              results.map((kost, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{kost.name}</h3>
                  <p>Harga: Rp {kost.price.toLocaleString()}</p>
                  <p>Lokasi: {kost.location}</p>
                  <p>Spesifikasi: {kost.specs}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Tidak ada hasil yang sesuai.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-6">
        <p>&copy; 2024 PENCARIAN Kost - Bandung. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
