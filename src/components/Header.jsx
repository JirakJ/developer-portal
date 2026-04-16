export default function Header({ user, onLogout, title }) {
  return (
    <header className="header">
      <h1 className="header-title">{title || 'Developer Portal'}</h1>
      <div className="header-user">
        <div className="header-avatar">
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="" style={{width: 32, height: 32, borderRadius: '50%'}} />
            : (user?.login?.[0] || 'U').toUpperCase()
          }
        </div>
        <span className="header-user-name">{user?.name || user?.login || 'User'}</span>
        <button className="btn-logout" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}
