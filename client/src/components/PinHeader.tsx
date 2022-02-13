import "./PinHeader.css";

export default function PinHeader({ pin }: { pin: string }) {
  return (
    <div className="pin-header">
      <div className="pin-header-container">
        <div className="pin-header-content">
          {/**  LEFT SIDE*/}
          <div className="pin-info">
            <div className="pin-info-left">
              <div className="join-text">
                Join at <strong>wwt-bio-m.com/play</strong>
              </div>
            </div>
            <div className="pin-info-right">
              <div className="join-pin">
                <div>Game PIN:</div>
                <div>{pin}</div>
              </div>
            </div>
          </div>
          {/**  Right SIDE*/}
        </div>
      </div>
    </div>
  );
}
