import React, { useState } from 'react';

const Collapsible = ({ title, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="collapsible">
            <div className="collapsible-header" onClick={toggleCollapse}>
                <h3>{title}</h3>
                <div className="arrow-icon">{isCollapsed ? '►' : '▲'}</div>
            </div>
            <div className={`collapsible-body ${isCollapsed ? 'collapsed' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default Collapsible;
