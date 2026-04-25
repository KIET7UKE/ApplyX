import React, { useEffect } from 'react';
import type { PlasmoCSConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';

export const config: PlasmoCSConfig = {
  matches: ['https://www.linkedin.com/*'],
  run_at: 'document_idle',
};

const storage = new Storage();

// Inject button styles once into document head
function injectStyles() {
  if (document.getElementById('ax-style')) return;
  const s = document.createElement('style');
  s.id = 'ax-style';
  s.textContent = `
    .ax-wrap { padding: 2px 12px 10px; }
    .ax-btn {
      display: flex !important; align-items: center !important;
      justify-content: center !important; gap: 6px !important;
      width: 100% !important; padding: 8px 0 !important;
      background: #fff !important; color: #0a66c2 !important;
      border: 1px solid #0a66c2 !important; border-radius: 20px !important;
      font-size: 13px !important; font-weight: 700 !important;
      cursor: pointer !important; transition: background .15s !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    .ax-btn:hover { background: #eff6ff !important; border-color: #0a66c2 !important; }
  `;
  document.head.appendChild(s);
}

function inject() {
  injectStyles();

  // Every post has exactly one "Open control menu for post by X" button — very stable
  document.querySelectorAll<HTMLElement>("button[aria-label^='Open control menu for post by']").forEach(menuBtn => {
    if ((menuBtn as any)._ax) return;
    (menuBtn as any)._ax = true;

    // Author name is in the aria-label
    const author = (menuBtn.getAttribute('aria-label') || '')
      .replace('Open control menu for post by ', '').trim();

    // Walk up to find post container — stop when we have the full post card
    // The post card contains data-testid="expandable-text-box"
    let post: Element | null = menuBtn;
    for (let i = 0; i < 20; i++) {
      if (!post) break;
      if (post.querySelector("[data-testid='expandable-text-box']")) break;
      post = post.parentElement;
    }
    if (!post) return;

    // Get post text
    const textEl = post.querySelector("[data-testid='expandable-text-box']");
    const postText = textEl ? (textEl as HTMLElement).innerText?.trim().slice(0, 3000) : '';

    // Get email from text
    const email = (postText.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/) || [''])[0];

    // Find the Like/Comment/Repost/Send action bar
    // It contains the "Reaction button state" button
    const reactionBtn = post.querySelector("[aria-label^='Reaction button']");
    if (!reactionBtn) return;

    // Walk up to find the action bar row (contains 3+ buttons)
    let bar: Element | null = reactionBtn;
    for (let i = 0; i < 6; i++) {
      if (!bar) break;
      if (bar.querySelectorAll('button').length >= 3) break;
      bar = bar.parentElement;
    }
    if (!bar) return;

    // Don't inject twice
    if (bar.nextElementSibling?.classList.contains('ax-wrap')) return;

    // Create button
    const wrap = document.createElement('div');
    wrap.className = 'ax-wrap';

    const btn = document.createElement('button');
    btn.className = 'ax-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
      ApplyX Outreach
    `;

    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      storage.set('triggerSidebar', { author, postText, email, timestamp: Date.now() });
    });

    wrap.appendChild(btn);

    // Insert right after the action bar
    bar.parentElement?.insertBefore(wrap, bar.nextSibling);
  });
}

const Injector = () => {
  useEffect(() => {
    setTimeout(inject, 1500);
    setTimeout(inject, 4000);

    const obs = new MutationObserver(() => setTimeout(inject, 400));
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);
  return null;
};

export default Injector;
