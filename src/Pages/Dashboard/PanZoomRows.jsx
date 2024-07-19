import React from "react";
import { Tooltip } from "@mui/material";
import SVGComponent from "Components/Svg/SVGComponent";
import { useSelector } from "react-redux";

const PanZoomRows = ({ iteminner }) => {
    const search = useSelector((state) => state.search.searchquery);
    const determineClassName = () => {
        const searchQuery = (search + "").trim().toLowerCase();
        const vehicleName = (iteminner?.vehicle + "").trim().toLowerCase();
        return searchQuery === vehicleName ? "rainbow" : "rainbownone";
    };

    const getItemBackgroundColor = () => iteminner?.location_type ?? "#DDE5FD";
    const getItemBorderColor = () => iteminner?.colors?.border ?? "#DDE5FD";
    const renderTooltip = () => {
      if (iteminner.vehicle) {
        return (
          <Tooltip
            className="number-tooltip"
            componentsProps={{
              tooltip: {
                className: "parking_tooltip",
              },
            }}
            title={<h2>{iteminner.vehicle}</h2>}
            placement="top"
          >
            <span>{iteminner.vehicle}</span>
          </Tooltip>
        );
      }
      return null;
    };

    const svgData = [
        { width: "23", height: "21", viewBox: "0 0 23 21", type: "repairing" },
        { width: "22", height: "26", viewBox: "0 0 22 26", type: "washing" },
        { width: "25", height: "21", viewBox: "0 0 25 21", type: "polishing" },
        { width: "27", height: "21", viewBox: "0 0 27 21", type: "pickup" },

    ];
    return (
            <div className={determineClassName()}>
                <div className="parkingmap-body-item"
                    style={{
                        backgroundColor: getItemBackgroundColor(),
                        border: `2px solid ${getItemBorderColor()}`,
                    }}
                >
                <div className="parkingmap-body-item-header">{renderTooltip()}</div>
                    <div className="menu-icons">
                        <ul>

                        {svgData.map((svgProps, index) => (
                            <SVGComponent
                                key={index}
                                iteminner={iteminner}
                                {...svgProps}
                            />
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
};

export default React.memo(PanZoomRows);
