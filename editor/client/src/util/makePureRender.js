import React, { PureComponent } from 'react'
import proxyFuncs from './proxyFuncs'

export default function makePureRender(Component) {
  class PureRenderWrapper extends PureComponent {
    render() {
      return <Component {...this.props} />;
    }
  }

  return proxyFuncs(PureRenderWrapper);
}
