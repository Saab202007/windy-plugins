"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-examples",
  "version": "0.5.0",
  "author": "Windyty, S.E.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/windycom/windy-plugins"
  },
  "description": "Windy plugin system enables anyone, with basic knowledge of Javascript to enhance Windy with new functionality (default desc).",
  "displayName": "Interpolator",
  "hook": "menu"
},
/* HTML */
'',
/* CSS */
'.weather-at-city{background:#00000096;padding:.1em .8em;border-radius:.3em}',
/* Constructor */
function () {
  var bcast = W.require('broadcast');

  var store = W.require('store');

  var _ = W.require('utils');

  var interpolator = W.require('interpolator');

  var map = W.require('map');

  var points = [['Yaşma', 'city-2', 49.39, 41.689], ['Xızı-2', 'city-2', 41.7, 49.38], ['Xızı-3', 'city-3', 41.71, 49.375], ['Qobustan', 'city-3', 41.0, 48.81], ['Pereküşkül', 'city-1', 40.2, 49.2857], ['Area-7', 'city-2', 39.9, 49.0]];
  var markers = null;
  var icon = L.divIcon({
    className: 'weather-at-city',
    iconSize: [80, 40],
    iconAnchor: [40, 20]
  });

  var createPopup = function createPopup(lat, lon, name) {
    var marker = L.marker([lat, lon], {
      icon: icon
    }).addTo(map);
    marker._icon.innerHTML = name;
    return marker;
  };

  var interpolateValues = function interpolateValues() {
    if (store.get('overlay') !== 'wind') {
      console.warn('I can iterpolate only Wind sorry');
      return;
    }

    interpolator(function (interpolate) {
      markers.forEach(function (m, i) {
        var _points$i = _slicedToArray(points[i], 4),
            name = _points$i[0],
            cls = _points$i[1],
            lon = _points$i[2],
            lat = _points$i[3];

        var values = interpolate.call(interpolator, {
          lat: lat,
          lon: lon
        });

        if (Array.isArray(values)) {
          var _$wind2obj = _.wind2obj(values),
              wind = _$wind2obj.wind,
              dir = _$wind2obj.dir;

          m._icon.innerHTML = "".concat(name, "<br />").concat(Math.round(wind), "m/s&nbsp;").concat(dir);
        } else {
          console.warn("Unable to interpolate value for ".concat(lat, ", ").concat(lon, "."));
        }
      });
    });
  };

  this.onopen = function () {
    map.setView({
      lat: 40.3,
      lng: 50
    }, 7);
    store.set('overlay', 'wind');

    if (!markers) {
      markers = points.map(function (p) {
        return createPopup(p[3], p[2], p[0]);
      });
      bcast.on('redrawFinished', interpolateValues);
    }

    interpolateValues();
  };

  this.onclose = function () {
    if (markers) {
      markers.forEach(function (m) {
        return map.removeLayer(m);
      });
      bcast.off('redrawFinished', interpolateValues);
      markers = null;
    }
  };
});