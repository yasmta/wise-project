import { useLanguage } from '../context/LanguageContext';
import './Ranking.css';

export default function Ranking() {
    const { t } = useLanguage();

    const users = [
        { rank: 1, name: 'EcoWarrior23', points: 1250 },
        { rank: 2, name: 'PlanetSaver', points: 980 },
        { rank: 3, name: 'GreenLife', points: 850 },
        { rank: 4, name: 'OzoneGuardian', points: 720 },
        { rank: 5, name: 'BioFan', points: 650 },
    ];

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem' }}>
            <header className="ranking-header">
                <h1>{t('rank_title')}</h1>
                <p>{t('rank_subtitle')}</p>
            </header>

            <div className="ranking-controls">
                <select className="season-select" defaultValue="global">
                    <option value="global">{t('rank_global')}</option>
                    <option value="season1">{t('rank_season')}</option>
                </select>
            </div>

            <div className="ranking-table-container card">
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th className="th-rank">{t('rank_col_pos')}</th>
                            <th className="th-name">{t('rank_col_name')}</th>
                            <th className="th-points">{t('rank_col_points')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.rank} className={user.rank <= 3 ? `top-${user.rank}` : ''}>
                                <td className="rank-cell">
                                    <span className="rank-badge">{user.rank}</span>
                                </td>
                                <td className="name-cell">{user.name}</td>
                                <td className="points-cell">{user.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
