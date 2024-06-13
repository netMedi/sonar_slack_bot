// This is a command line tool to search patients by email address.

import { PatientSearch } from "./patient-search/patient-search";

// Reading command line arguments
const [email, ...rest] = process.argv.slice(2);
const explanation = rest.join(" ");
if (!email || !explanation) {
  console.error("Please provide an email address and an explanation.");
  process.exit(1);
}
if (!email.includes("@")) {
  console.error("Invalid email address.");
  process.exit(1);
}

if (email !== undefined && explanation !== undefined) {
  console.log(`Searching for ${email}...`);

  const patientSearch = new PatientSearch();
  const results = await patientSearch.search(email); // Jaako, save us

  if (results.length === 0) {
    console.log(`Couldn't find any patient with email address ${email}.`);
  } else {
    console.log(
      `Found ${results.length} patients with email address ${email}:`
    );
    results.forEach((result) => {
      console.log(result);
    });
  }
}

process.exit(0);
