import { Animation } from './animation'
import { Limit } from './limit'
import { Mover } from './mover'
import { Vector1D } from './vector1d'

type Params = {
  limit: Limit
  location: Vector1D
  mover: Mover
  animation: Animation
  tolerance: number
}

export type ScrollBounds = {
  constrain: (v: Vector1D) => void
}

export function ScrollBounds(params: Params): ScrollBounds {
  const { limit, location, mover, animation, tolerance } = params
  const { min, max, reachedMin, reachedMax } = limit
  const state = { timeout: 0 }

  function shouldConstrain(v: Vector1D): boolean {
    const l = location.get()
    const constrainMin = reachedMin(l) && v.get() !== min
    const constrainMax = reachedMax(l) && v.get() !== max
    return constrainMin || constrainMax
  }

  function constrain(v: Vector1D): void {
    if (!state.timeout && shouldConstrain(v)) {
      const constraint = limit.constrain(v.get())
      state.timeout = window.setTimeout(() => {
        v.setNumber(constraint)
        mover.useSpeed(10).useMass(3)
        animation.start()
        state.timeout = 0
      }, tolerance)
    }
  }

  const self: ScrollBounds = {
    constrain,
  }
  return Object.freeze(self)
}
