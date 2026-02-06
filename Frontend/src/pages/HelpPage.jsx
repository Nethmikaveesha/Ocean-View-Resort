import React, { useEffect, useState } from 'react';

export function HelpPage() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/help/customer')
      .then((res) => res.text())
      .then(setText)
      .catch(() => setText('Help information is currently unavailable.'));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">How to Use the System</h1>
      <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded border text-sm text-slate-800">
        {text}
      </pre>
    </div>
  );
}

