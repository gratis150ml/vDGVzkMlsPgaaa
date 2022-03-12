import { useState, useEffect } from "react";
export default function Home() {
  useEffect(() => {
    const logged = localStorage.getItem("logged");
    if (logged) {
      const rf = localStorage.getItem("refresh_token");
      const tk = localStorage.getItem("token");
      console.log(rf);
      console.log(tk);
    }
  }, []);
  return (
    <>
      <p>hey</p>
    </>
  );
}
