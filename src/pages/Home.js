import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/getRoom">
        <a>
          <button>create room</button>
        </a>
      </Link>
    </div>
  );
}

export default Home;
