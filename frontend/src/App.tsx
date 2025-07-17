import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';

function injectKeyframes() {
  if (document.getElementById('movie-detail-anim')) return;
  const style = document.createElement('style');
  style.id = 'movie-detail-anim';
  style.innerHTML = `
    @keyframes fadeInScale {
      0% { opacity: 0; transform: scale(0.95) translateY(40px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// Update color scheme
const NETFLIX_RED = '#e50914';
const NETFLIX_BLACK = '#141414';
const NETFLIX_DARK = '#181818';

const appStyles: React.CSSProperties = {
  minHeight: '100vh',
  padding: '0 0 48px 0',
  fontFamily: 'Segoe UI, Arial, sans-serif',
  color: '#fff',
  background: 'transparent',
};

const neonText: React.CSSProperties = {
  color: NETFLIX_RED,
  textShadow: '0 0 8px #e5091466, 0 0 2px #fff',
  fontWeight: 900,
};

const cardStyles: React.CSSProperties = {
  background: NETFLIX_DARK,
  borderRadius: 14,
  boxShadow: '0 2px 12px #0008',
  border: '2px solid transparent',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
  marginBottom: 8,
  minWidth: 180,
  maxWidth: 220,
};

const placeholderPoster = 'https://via.placeholder.com/220x320/181818/e50914?text=No+Poster';
const placeholderTrailer = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up

const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: 64,
  background: NETFLIX_BLACK,
  color: NETFLIX_RED,
  fontWeight: 900,
  fontSize: 28,
  letterSpacing: 2,
  display: 'flex',
  alignItems: 'center',
  zIndex: 100,
  boxShadow: '0 2px 12px #0008',
  paddingLeft: 40,
  borderBottom: `2px solid ${NETFLIX_RED}`,
};

const mainStyles: React.CSSProperties = {
  ...appStyles,
  marginTop: 80,
  background: 'rgba(20, 20, 20, 0.96)',
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
};

const rowTitleStyles: React.CSSProperties = {
  ...neonText,
  fontSize: 22,
  margin: '32px 0 12px 0',
  letterSpacing: 1,
  fontWeight: 800,
};
const rowGridStyles: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  overflowX: 'auto',
  paddingBottom: 12,
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE 10+
};

// Hide scrollbar for Chrome, Safari and Opera
const rowGridContainerStyles: React.CSSProperties = {
  position: 'relative',
};

const rowCardStyles: React.CSSProperties = {
  ...cardStyles,
  minWidth: 180,
  maxWidth: 220,
  scrollSnapAlign: 'start',
  transition: 'transform 0.18s, box-shadow 0.18s, border 0.18s',
};
const rowCardHoverStyles: React.CSSProperties = {
  ...rowCardStyles,
  border: `2px solid ${NETFLIX_RED}`,
  boxShadow: `0 0 24px ${NETFLIX_RED}, 0 2px 12px rgba(229,9,20,0.18)`,
  transform: 'scale(1.08) translateY(-8px)',
  zIndex: 2,
};

// Arrow button styles
const arrowBtnStyles: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(20,20,20,0.8)',
  border: `2px solid ${NETFLIX_RED}`,
  color: NETFLIX_RED,
  borderRadius: '50%',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 2px 8px #000a',
  transition: 'background 0.2s, color 0.2s',
  opacity: 0.85,
};

const arrowBtnLeft: React.CSSProperties = {
  ...arrowBtnStyles,
  left: 0,
};
const arrowBtnRight: React.CSSProperties = {
  ...arrowBtnStyles,
  right: 0,
};

// Add modal overlay styles
const modalOverlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.85)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const modalContentStyles: React.CSSProperties = {
  minWidth: 340,
  maxWidth: 600,
  width: '90vw',
  background: '#181818',
  borderRadius: 14,
  boxShadow: '0 2px 32px #000a',
  color: '#fff',
  padding: 32,
  position: 'relative',
  animation: 'fadeInScale 0.45s cubic-bezier(.4,1.6,.6,1) both',
  border: '2px solid #232946',
};

// Add star icon for ratings
const Star = () => <span style={{ color: '#FFD700', marginRight: 4, fontSize: 18 }}>★</span>;

// Header nav styles
const navLinkStyles: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 18,
  margin: '0 18px',
  transition: 'color 0.2s',
};
const navLinkActive: React.CSSProperties = {
  ...navLinkStyles,
  color: '#00bfff',
  fontWeight: 700,
};
const headerNavStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginLeft: 40,
};
const searchBarStyles: React.CSSProperties = {
  background: '#111',
  border: '1px solid #333',
  borderRadius: 6,
  color: '#fff',
  fontSize: 16,
  padding: '7px 12px',
  marginLeft: 32,
  marginRight: 24,
  width: 180,
};
const loginBtnStyles: React.CSSProperties = {
  background: 'transparent',
  border: '1.5px solid #00bfff',
  color: '#00bfff',
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 16,
  padding: '7px 22px',
  marginLeft: 18,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

// Hero section styles
const heroStyles: React.CSSProperties = {
  background: '#111',
  color: '#fff',
  padding: '56px 0 32px 0',
  textAlign: 'center',
  borderBottom: '2px solid #222',
};
const heroTitle: React.CSSProperties = {
  fontSize: 38,
  fontWeight: 900,
  marginBottom: 18,
  letterSpacing: 1,
};
const heroSubtitle: React.CSSProperties = {
  fontSize: 18,
  color: '#bbb',
  maxWidth: 700,
  margin: '0 auto 28px auto',
};
const heroBtn: React.CSSProperties = {
  background: '#0099ff',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 18,
  padding: '12px 38px',
  cursor: 'pointer',
  boxShadow: '0 2px 12px #0099ff44',
};

// Movie row styles
const showcaseRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: 32,
  flexWrap: 'wrap',
  justifyContent: 'center', // Center the cards
  padding: '36px 32px 24px 32px', // Symmetric left/right padding
  background: '#181818',
  borderBottom: '2px solid #222',
  marginTop: '100px', // Add more space above
};
const showcaseCardStyles: React.CSSProperties = {
  background: '#111',
  borderRadius: 12,
  boxShadow: '0 2px 16px #000a',
  minWidth: 220,
  maxWidth: 260,
  color: '#fff',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'transform 0.18s, box-shadow 0.18s',
};
const showcaseCardHover: React.CSSProperties = {
  ...showcaseCardStyles,
  transform: 'scale(1.06) translateY(-8px)',
  boxShadow: '0 0 24px #000a, 0 2px 12px #23294644',
  zIndex: 2,
};
const showcasePoster: React.CSSProperties = {
  width: '100%',
  height: 340,
  objectFit: 'cover',
  borderRadius: '12px 12px 0 0',
  marginBottom: 0,
};
const showcaseInfo: React.CSSProperties = {
  padding: '16px 18px 12px 18px',
  width: '100%',
};

// GenrePage component for genre-specific movie lists
function GenrePage({ movies, genres, FILMS_PER_PAGE, favorites, toggleFavorite, authUser }: { movies: any[], genres: string[], FILMS_PER_PAGE: number, favorites: number[], toggleFavorite: (id: number) => void, authUser: any }) {
  const { genreName } = useParams();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const [showcaseHovered, setShowcaseHovered] = useState<number | null>(null);
  const genreMovies = movies.filter(m => Array.isArray(m.genres) && m.genres.includes(genreName));
  const totalPages = Math.ceil(genreMovies.length / FILMS_PER_PAGE);
  const paged = genreMovies.slice((page - 1) * FILMS_PER_PAGE, page * FILMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [genreName]);
  const trailerHeading: React.CSSProperties = {
    color: '#f4faff',
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 10,
  };
  return (
    <div style={{ minHeight: '100vh', background: 'rgba(20, 20, 20, 0.96)', boxShadow: '0 4px 32px rgba(0,0,0,0.18)' }}>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 32, margin: '120px 0 18px 0', textAlign: 'center' }}>{genreName} Movies</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, justifyContent: 'center', padding: '36px 32px 24px 32px', background: '#181818', borderBottom: '2px solid #222', marginTop: '40px', maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto' }}>
        {paged.map(m => (
          <div
            key={m.id}
            style={showcaseHovered === m.id ? showcaseCardHover : showcaseCardStyles}
            onClick={() => setSelected(m)}
            onMouseEnter={() => setShowcaseHovered(m.id)}
            onMouseLeave={() => setShowcaseHovered(null)}
          >
            <MoviePoster
              src={m.posterUrl || m.poster_url || placeholderPoster}
              alt={m.title + ' poster'}
              style={showcasePoster}
            />
            <div style={showcaseInfo}>
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                <Star />
                <span style={{ fontSize: 16, color: '#FFD700', marginRight: 8 }}>{m.rating ? m.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{m.title}</div>
              <div style={{ color: '#bbb', fontSize: 15 }}>
                {(() => {
                  const genresStr = Array.isArray(m.genres) && m.genres.length > 0 ? m.genres.join(', ') : (m.category || 'Other');
                  return genresStr.length > 24 ? genresStr.slice(0, 24) + '...' : genresStr;
                })()}
                {m.year ? `, ${m.year}` : ''}
              </div>
              {authUser && (
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                  <HeartButton
                    isFavorite={favorites.includes(m.id)}
                    onClick={e => { e.stopPropagation(); toggleFavorite(m.id); }}
                    size={28}
                    title={favorites.includes(m.id) ? 'Remove from favorites' : 'Add to favorites'}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 48px 0', gap: 8 }}>
          <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} style={{ background: '#232946', color: '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 18, padding: '8px 14px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, marginRight: 4, }}>{'<'}</button>
          {(() => {
            const pages = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              let left = Math.max(2, page - 2);
              let right = Math.min(totalPages - 1, page + 2);
              if (left > 2) pages.push('...');
              for (let i = left; i <= right; i++) pages.push(i);
              if (right < totalPages - 1) pages.push('...');
              pages.push(totalPages);
            }
            return pages.map((p, idx) =>
              p === '...'
                ? <span key={"ellipsis-"+idx} style={{ color: '#b3b3b3', fontSize: 18, padding: '0 8px' }}>...</span>
                : <button key={p} onClick={() => setPage(Number(p))} style={{ background: page === p ? '#00bfff' : '#232946', color: page === p ? '#fff' : '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, padding: '8px 14px', cursor: 'pointer', boxShadow: page === p ? '0 0 8px #00bfff' : 'none', transition: 'background 0.2s, color 0.2s', margin: '0 2px', }}>{p}</button>
            );
          })()}
          <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} style={{ background: '#232946', color: '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 18, padding: '8px 14px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, marginLeft: 4, }}>{'>'}</button>
        </div>
      )}
      {/* Modal overlay for detail panel */}
      {selected && (
        <div style={modalOverlayStyles} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={modalContentStyles}>
            <button style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', color: '#00bfff', textShadow: '0 0 8px #00bfff' }} onClick={() => setSelected(null)} aria-label="Close details">×</button>
            <h2 style={{ ...neonText, fontSize: 28, color: '#00bfff' }}>{selected.title} {selected.year && <span style={{ color: '#b8c1ec', fontSize: 22 }}>({selected.year})</span>}</h2>
            {selected.genres && selected.genres.length > 0 && (
              <div style={{ color: '#b3b3b3', fontSize: 16, marginBottom: 8 }}>
                Genres: {selected.genres.join(', ')}
              </div>
            )}
            {selected.director && <p><b>Director:</b> {selected.director}</p>}
            {selected.rating && <p><b>Rating:</b> {selected.rating}</p>}
            {selected.description && <p style={{ marginTop: 14 }}>{selected.description}</p>}
            <div style={{ marginTop: 28 }}>
              <h3 style={trailerHeading}>Trailer / Movie Player</h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, background: 'linear-gradient(135deg, #232946 60%, #393e5c 100%)', border: '2px solid #232946', boxShadow: '0 2px 12px #000a' }}>
                <iframe src={selected.trailer_url || selected.trailer || placeholderTrailer} title={selected.title + ' trailer'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 10 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </div>
            {authUser && selected && (
              <div style={{ position: 'absolute', top: 18, right: 54, zIndex: 2 }}>
                <HeartButton
                  isFavorite={favorites.includes(selected.id)}
                  onClick={e => { e.stopPropagation(); toggleFavorite(selected.id); }}
                  size={34}
                  title={favorites.includes(selected.id) ? 'Remove from favorites' : 'Add to favorites'}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MoviePoster({ src, alt, style }: { src: string; alt: string; style: React.CSSProperties }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <img
      src={!imgError ? src : placeholderPoster}
      alt={alt}
      style={style}
      onError={() => setImgError(true)}
    />
  );
}

function App() {
  useEffect(() => {
    document.body.style.background = 'linear-gradient(135deg, #141414 0%, #181818 100%)';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    injectKeyframes();
    // Hide scrollbars globally
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar { display: none; }
      body { background: linear-gradient(135deg, #141414 0%, #181818 100%) !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.body.style.background = '';
      document.body.style.minHeight = '';
      document.body.style.margin = '';
      document.head.removeChild(style);
    };
  }, []);

  const inputStyles: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #393e5c',
    marginRight: 12,
    fontSize: 17,
    background: '#232946',
    color: '#f4faff',
    outline: 'none',
    boxShadow: '0 0 0 2px #232946',
  };

  const selectStyles: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #393e5c',
    fontSize: 17,
    marginRight: 12,
    background: '#232946',
    color: '#f4faff',
    outline: 'none',
  };

  const listStyles: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    marginTop: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 28,
  };

  const cardHoverStyles: React.CSSProperties = {
    ...cardStyles,
    border: '2px solid #00fff7',
    boxShadow: '0 0 16px #00fff7, 0 2px 12px rgba(0,255,255,0.18)',
  };

  const posterStyles: React.CSSProperties = {
    width: '100%',
    height: 240,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 10,
    background: '#232946',
    boxShadow: '0 0 12px #00fff7',
  };

  const detailStyles: React.CSSProperties = {
    marginTop: 36,
    padding: 28,
    background: 'linear-gradient(135deg, #232946 60%, #393e5c 100%)',
    borderRadius: 14,
    boxShadow: '0 2px 16px #00fff7',
    color: '#f4faff',
  };

  interface Movie {
    id: number;
    title: string;
    year: number;
    description?: string;
    director?: string;
    rating?: number;
    poster_url?: string;
    trailer_url?: string;
    trailer?: string;
    category?: string; // Added category for grouping
    genres?: string[]; // Added genres for detail modal
  }

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<'title' | 'year'>("title");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [page, setPage] = useState(1);
  const FILMS_PER_PAGE = 20;
  // For row scrolling
  const rowRefs = React.useRef<{ [key: string]: HTMLUListElement | null }>({});
  // Add drag-to-scroll state and handlers in App
  // Remove drag-to-scroll and inertia state
  // Remove all draggingCat, dragStartX, dragScrollLeft, velocity, inertiaRef, and related handlers
  // Restore onClick for movie cards in both row and grid views
  const [showcaseHovered, setShowcaseHovered] = useState<number | null>(null);
  // Add pagination state and logic
  // Remove showcasePage, showcaseMovies, totalShowcasePages, and pagination controls
  // In the render, use sorted.slice(0, 20) to show the first 20 movies (or all if you prefer)
  const trailerHeading: React.CSSProperties = {
    color: '#f4faff',
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 10,
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [genreDropdown, setGenreDropdown] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  // Move favorites and toggleFavorite to top-level App function
  const [favorites, setFavorites] = React.useState<number[]>([]);
  const toggleFavorite = async (movieId: number) => {
    if (!auth.token) return;
    if (favorites.includes(movieId)) {
      await fetch(`http://localhost:8000/favorites/${movieId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setFavorites((favs: number[]) => favs.filter((id: number) => id !== movieId));
    } else {
      await fetch(`http://localhost:8000/favorites/${movieId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setFavorites((favs: number[]) => [...favs, movieId]);
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/json/genres')
      .then(res => res.json())
      .then(data => setGenres(['All', ...data]))
      .catch(() => setGenres(['All']));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/json/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selected) {
      setShowDetail(false);
      setTimeout(() => setShowDetail(true), 10);
    } else {
      setShowDetail(false);
    }
  }, [selected]);

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(filter.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "title") {
      return a.title.localeCompare(b.title);
    } else if (sort === "year") {
      return (a.year || 0) - (b.year || 0);
    }
    return 0;
  });

  // Filter by selected genre
  const genreMovies = selectedGenre === 'All'
    ? sorted
    : sorted.filter(m => Array.isArray(m.genres) && m.genres.includes(selectedGenre));

  // Pagination logic for single genre
  const totalPages = Math.ceil(genreMovies.length / FILMS_PER_PAGE);
  const paged = genreMovies.slice((page - 1) * FILMS_PER_PAGE, page * FILMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [selectedGenre, filter, sort]);

  const auth = useAuth();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  // Show modal on first load if not logged in
  React.useEffect(() => {
    if (!auth.user && !auth.loading) setAuthModalOpen(true);
  }, [auth.user, auth.loading]);
  // Close modal on login
  React.useEffect(() => {
    if (auth.user) setAuthModalOpen(false);
  }, [auth.user]);

  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  return (
    <>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      {auth.user && !auth.loading && (
        <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 2000, background: '#181818', color: '#fff', padding: 16, borderBottomLeftRadius: 12, boxShadow: '0 2px 8px #000a', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{ cursor: 'pointer', textDecoration: 'underline dotted', fontWeight: 600 }}
            onClick={() => setProfileModalOpen(true)}
            title="View profile"
          >
            Welcome, <b>{auth.user.username}</b> ({auth.user.role})
          </span>
          <button style={{ background: '#00bfff', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }} onClick={auth.logout}>Logout</button>
        </div>
      )}
      <UserProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} user={auth.user} favorites={favorites} setFavorites={setFavorites} />
      {!auth.user && !auth.loading && !authModalOpen && (
        <button
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 2000, background: '#00bfff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', boxShadow: '0 2px 8px #00bfff44', cursor: 'pointer' }}
          onClick={() => setAuthModalOpen(true)}
        >
          Login/Register
        </button>
      )}
      {/* Admin-only UI */}
      {auth.user && auth.user.role === 'admin' && (
        <div style={{ position: 'fixed', top: 70, right: 0, zIndex: 2000, background: '#232946', color: '#fff', padding: 16, borderBottomLeftRadius: 12, boxShadow: '0 2px 8px #000a', marginTop: 8 }}>
          <b>Admin Panel</b>
          <AdminPanel token={auth.token} />
        </div>
      )}
      {/* Header */}
      <header style={{ ...headerStyles, height: 72, background: '#000', borderBottom: '2px solid #222', paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1400, margin: '0 auto', height: '100%' }}>
          <Link
            to="/"
            onClick={e => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.location.reload();
              }
            }}
            style={{ fontWeight: 900, fontSize: 32, color: '#00bfff', letterSpacing: 2, marginLeft: 32, textDecoration: 'none', cursor: 'pointer' }}
          >
            Filmax
          </Link>
          <nav style={headerNavStyles}>
            <Link
              to="/"
              onClick={e => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              style={navLinkActive}
            >
              Home
            </Link>
            <span style={{ color: '#b3b3b3', margin: '0 8px' }}>|</span>
            {/* Modern genre dropdown with label and custom arrow */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 8, marginRight: 8 }}>
              <span style={{ color: '#b3b3b3', fontWeight: 600, fontSize: 16, marginRight: 8 }}>Genres</span>
              <select
                value={genreDropdown}
                onChange={e => {
                  setGenreDropdown(e.target.value);
                  if (e.target.value) navigate(`/genre/${encodeURIComponent(e.target.value)}`);
                }}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  background: '#181818',
                  color: '#fff',
                  border: '2px solid #232946',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '8px 38px 8px 18px',
                  boxShadow: '0 2px 8px #0004',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => e.currentTarget.style.border = '2px solid #00bfff'}
                onBlur={e => e.currentTarget.style.border = '2px solid #232946'}
              >
                <option value="">Browse by Genre</option>
                {genres.slice(1).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {/* Custom arrow */}
              <span style={{
                position: 'absolute',
                right: 16,
                pointerEvents: 'none',
                color: '#00bfff',
                fontSize: 18,
                top: '50%',
                transform: 'translateY(-50%)',
              }}>▼</span>
            </div>
          </nav>
          <input
            style={searchBarStyles}
            placeholder="Quick Search"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          />
        </div>
      </header>
      <Routes>
        <Route path="/" element={
          <>
            {/* Showcase row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 48,
              justifyContent: 'center',
              padding: '36px 32px 24px 32px',
              background: '#181818',
              borderBottom: '2px solid #222',
              marginTop: '100px',
              minHeight: '5 * 340px', // 5 rows of poster height (optional, for consistent height)
              maxWidth: 1400,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {paged.map(m => (
                <div
                  key={m.id}
                  style={{ ...(showcaseHovered === m.id ? showcaseCardHover : showcaseCardStyles), position: 'relative' }}
                  onClick={() => setSelected(m)}
                  onMouseEnter={() => setShowcaseHovered(m.id)}
                  onMouseLeave={() => setShowcaseHovered(null)}
                >
                  {/* HeartButton absolutely positioned at top-right, above poster */}
                  {auth.user && (
                    <HeartButton
                      isFavorite={favorites.includes(m.id)}
                      onClick={e => { e.stopPropagation(); toggleFavorite(m.id); }}
                      size={28}
                      title={favorites.includes(m.id) ? 'Remove from favorites' : 'Add to favorites'}
                      style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, background: 'rgba(24,24,24,0.92)', borderRadius: '50%', boxShadow: '0 2px 8px #000a', padding: 4 }}
                    />
                  )}
                  <MoviePoster
                    src={m.posterUrl || m.poster_url || placeholderPoster}
                    alt={m.title + ' poster'}
                    style={showcasePoster}
                  />
                  <div style={showcaseInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                      <Star />
                      <span style={{ fontSize: 16, color: '#FFD700', marginRight: 8 }}>{m.rating ? m.rating.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{m.title}</div>
                    <div style={{ color: '#bbb', fontSize: 15 }}>
                      {(() => {
                        const genresStr = Array.isArray(m.genres) && m.genres.length > 0 ? m.genres.join(', ') : (m.category || 'Other');
                        return genresStr.length > 24 ? genresStr.slice(0, 24) + '...' : genresStr;
                      })()}
                      {m.year ? `, ${m.year}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 48px 0', gap: 8 }}>
                <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} style={{ background: '#232946', color: '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 18, padding: '8px 14px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, marginRight: 4, }}>{'<'}</button>
                {(() => {
                  const pages = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    let left = Math.max(2, page - 2);
                    let right = Math.min(totalPages - 1, page + 2);
                    if (left > 2) pages.push('...');
                    for (let i = left; i <= right; i++) pages.push(i);
                    if (right < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages.map((p, idx) =>
                    p === '...'
                      ? <span key={"ellipsis-"+idx} style={{ color: '#b3b3b3', fontSize: 18, padding: '0 8px' }}>...</span>
                      : <button key={p} onClick={() => setPage(Number(p))} style={{ background: page === p ? '#00bfff' : '#232946', color: page === p ? '#fff' : '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, padding: '8px 14px', cursor: 'pointer', boxShadow: page === p ? '0 0 8px #00bfff' : 'none', transition: 'background 0.2s, color 0.2s', margin: '0 2px', }}>{p}</button>
                  );
                })()}
                <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} style={{ background: '#232946', color: '#b3b3b3', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 18, padding: '8px 14px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, marginLeft: 4, }}>{'>'}</button>
              </div>
            )}
            {/* Modal overlay for detail panel */}
            {selected && (
              <div style={modalOverlayStyles} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
                <div style={modalContentStyles}>
                  <button style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', color: '#00bfff', textShadow: '0 0 8px #00bfff' }} onClick={() => setSelected(null)} aria-label="Close details">×</button>
                  <h2 style={{ ...neonText, fontSize: 28, color: '#00bfff' }}>{selected.title} {selected.year && <span style={{ color: '#b8c1ec', fontSize: 22 }}>({selected.year})</span>}</h2>
                  {selected.genres && selected.genres.length > 0 && (
                    <div style={{ color: '#b3b3b3', fontSize: 16, marginBottom: 8 }}>
                      Genres: {selected.genres.join(', ')}
                    </div>
                  )}
                  {selected.director && <p><b>Director:</b> {selected.director}</p>}
                  {selected.rating && <p><b>Rating:</b> {selected.rating}</p>}
                  {selected.description && <p style={{ marginTop: 14 }}>{selected.description}</p>}
                  <div style={{ marginTop: 28 }}>
                    <h3 style={trailerHeading}>Trailer / Movie Player</h3>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, background: 'linear-gradient(135deg, #232946 60%, #393e5c 100%)', border: '2px solid #232946', boxShadow: '0 2px 12px #000a' }}>
                      <iframe src={selected.trailer_url || selected.trailer || placeholderTrailer} title={selected.title + ' trailer'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 10 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  </div>
                  {auth.user && selected && (
                    <HeartButton
                      isFavorite={favorites.includes(selected.id)}
                      onClick={e => { e.stopPropagation(); toggleFavorite(selected.id); }}
                      size={34}
                      title={favorites.includes(selected.id) ? 'Remove from favorites' : 'Add to favorites'}
                      style={{ position: 'absolute', top: 18, right: 18, zIndex: 2, background: 'rgba(24,24,24,0.92)', borderRadius: '50%', boxShadow: '0 2px 8px #000a', padding: 6 }}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        } />
        <Route path="/genre/:genreName" element={<GenrePage movies={movies} genres={genres} FILMS_PER_PAGE={FILMS_PER_PAGE} favorites={favorites} toggleFavorite={toggleFavorite} authUser={auth.user} />} />
      </Routes>
    </>
  );
}

export default App;

function AdminPanel({ token }: { token: string | null }) {
  const [result, setResult] = React.useState<string>('');
  const callAdmin = async () => {
    setResult('Loading...');
    const res = await fetch('http://localhost:8000/admin-only', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data.message);
    } else {
      setResult('Access denied or error.');
    }
  };
  return (
    <div style={{ marginTop: 8 }}>
      <button style={{ background: '#e50914', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }} onClick={callAdmin}>
        Call Admin Endpoint
      </button>
      {result && <div style={{ marginTop: 8 }}>{result}</div>}
    </div>
  );
}

function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auth = useAuth();
  const [authTab, setAuthTab] = React.useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = React.useState({ username: '', password: '' });
  const [authError, setAuthError] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#181818', borderRadius: 16, boxShadow: '0 4px 32px #000a', padding: 36, minWidth: 340, maxWidth: 380, width: '90vw', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#bbb', fontSize: 28, cursor: 'pointer', fontWeight: 700 }}
          aria-label="Close auth modal"
        >×</button>
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, width: '100%' }}>
          <button onClick={() => setAuthTab('login')} style={{ flex: 1, background: authTab === 'login' ? '#00bfff' : 'transparent', color: authTab === 'login' ? '#fff' : '#b3b3b3', border: 'none', borderRadius: '12px 0 0 12px', fontWeight: 700, fontSize: 18, padding: '12px 0', cursor: 'pointer', transition: 'background 0.2s' }}>Login</button>
          <button onClick={() => setAuthTab('register')} style={{ flex: 1, background: authTab === 'register' ? '#00bfff' : 'transparent', color: authTab === 'register' ? '#fff' : '#b3b3b3', border: 'none', borderRadius: '0 12px 12px 0', fontWeight: 700, fontSize: 18, padding: '12px 0', cursor: 'pointer', transition: 'background 0.2s' }}>Register</button>
        </div>
        {authTab === 'login' ? (
          <form onSubmit={async e => { e.preventDefault(); setAuthError(''); const ok = await auth.login(loginForm.username, loginForm.password); if (!ok) setAuthError('Invalid credentials'); }} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
            <input placeholder="Username" value={loginForm.username} onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #232946', background: '#232946', color: '#fff', fontSize: 17 }} />
            <input placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #232946', background: '#232946', color: '#fff', fontSize: 17 }} />
            <button type="submit" style={{ background: '#00bfff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '12px 0', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px #00bfff44' }}>Login</button>
            {authError && <div style={{ color: '#ff4d4f', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>{authError}</div>}
          </form>
        ) : (
          <form onSubmit={async e => { e.preventDefault(); setAuthError(''); const ok = await auth.register(registerForm.username, registerForm.password); if (!ok) setAuthError('Registration failed'); else setAuthError('Registered! You can now log in.'); }} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
            <input placeholder="Username" value={registerForm.username} onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #232946', background: '#232946', color: '#fff', fontSize: 17 }} />
            <input placeholder="Password" type="password" value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #232946', background: '#232946', color: '#fff', fontSize: 17 }} />
            <button type="submit" style={{ background: '#00bfff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '12px 0', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px #00bfff44' }}>Register</button>
            {authError && <div style={{ color: authError.startsWith('Registered') ? '#00ff99' : '#ff4d4f', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>{authError}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

function UserProfileModal({ open, onClose, user, favorites, setFavorites }: { open: boolean; onClose: () => void; user: any; favorites: number[]; setFavorites: (favs: number[]) => void }) {
  const auth = useAuth();
  const [favoriteFilms, setFavoriteFilms] = React.useState<{ id: number; title: string; year: number }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open || !user || !auth.token) return;
    setLoading(true);
    fetch('http://localhost:8000/favorites', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setFavoriteFilms(data);
        setFavorites(data.map((f: any) => f.id));
      })
      .finally(() => setLoading(false));
  }, [open, user, auth.token, setFavorites]);

  const removeFavorite = async (movieId: number) => {
    if (!auth.token) return;
    await fetch(`http://localhost:8000/favorites/${movieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setFavoriteFilms(favs => favs.filter(f => f.id !== movieId));
    setFavorites(favorites.filter((id: number) => id !== movieId));
  };

  if (!open || !user) return null;
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#181818', borderRadius: 16, boxShadow: '0 4px 32px #000a', padding: 36, minWidth: 340, maxWidth: 420, width: '90vw', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#bbb', fontSize: 28, cursor: 'pointer', fontWeight: 700 }}
          aria-label="Close profile modal"
        >×</button>
        <h2 style={{ marginBottom: 12 }}>Profile: {user.username}</h2>
        <div style={{ color: '#b3b3b3', marginBottom: 18 }}>Role: {user.role}</div>
        <h3 style={{ marginBottom: 8 }}>Favorite Films</h3>
        {loading ? (
          <div style={{ color: '#bbb', margin: '16px 0' }}>Loading...</div>
        ) : favoriteFilms.length === 0 ? (
          <div style={{ color: '#bbb', margin: '16px 0' }}>No favorites yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
            {favoriteFilms.map(film => (
              <li key={film.id} style={{ padding: '8px 0', borderBottom: '1px solid #232946', fontSize: 17, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{film.title} <span style={{ color: '#bbb', fontSize: 15 }}>({film.year})</span></span>
                <button onClick={() => removeFavorite(film.id)} style={{ background: 'none', border: 'none', color: '#e50914', fontWeight: 700, fontSize: 18, cursor: 'pointer' }} title="Remove from favorites">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HeartButton({ isFavorite, onClick, size = 28, style = {}, title = '' }: { isFavorite: boolean; onClick: (e: React.MouseEvent) => void; size?: number; style?: React.CSSProperties; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
        margin: 0,
        outline: 'none',
        transition: 'transform 0.15s',
        ...style,
      }}
      aria-label={title || (isFavorite ? 'Remove from favorites' : 'Add to favorites')}
      className="heart-btn"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isFavorite ? '#e50914' : 'none'}
        stroke={isFavorite ? '#e50914' : '#bbb'}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: isFavorite
            ? 'drop-shadow(0 2px 6px #e5091444)'
            : 'drop-shadow(0 1px 2px #0008)',
          transition: 'fill 0.2s, stroke 0.2s, filter 0.2s',
          display: 'block',
        }}
      >
        {/* Material Design heart */}
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <style>
        {`
          .heart-btn:active svg {
            transform: scale(1.18);
          }
        `}
      </style>
    </button>
  );
}
