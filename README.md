<a href="https://github.com/spaneco/vue-hot-toast/"><img alt="vue-hot-toast - Try it out" src="https://raw.githubusercontent.com/spaneco/vue-hot-toast/prod/assets/header.svg"/></a>

<div align="center">
    <img src="https://img.shields.io/npm/v/@spaneco/vue-hot-toast" alt="NPM Version" />
    <img src="https://img.shields.io/bundlephobia/minzip/%40spaneco%2Fvue-hot-toast" alt="minzipped size"/>
    <img src="https://img.shields.io/npm/l/@spaneco/vue-hot-toast" alt="License" />
</a>
</div>
<br />
<div align="center"><strong>Smoking hot  Notifications for Vue.</strong></div>
<div align="center"> Lightweight, customizable and beautiful by default.</div>
<br />
<div align="center">
<a href="https://react-hot-toast.com/">Website</a> 
<span> · </span>
<a href="https://react-hot-toast.com/docs">Documentation</a> 
</div>

<br />
<div align="center">
  <sub>Cooked by <a href="https://twitter.com/todo">Jiri Laza</a> 👨‍🍳</sub>
</div>

<br />

## Features

- 🔥 **Hot by default**
- 🔩 **Easily Customizable**
- ⏳ **Promise API** - _Automatic loader from a promise_
- 🕊 **Lightweight** - _less than 3.6kb including styles_
- ✅ **Accessible**
- 🤯 **Headless Hooks** - _Create your own with [`useToaster()`](https://react-hot-toast.com/docs/use-toaster)_

## Installation

#### With pnpm

```sh
pnpm add @spaneco/vue-hot-toast
```

#### With NPM

```sh
npm install @spaneco/vue-hot-toast
```

## Getting Started

Add the Toaster to your app first. It will take care of rendering all notifications emitted. Now you can trigger `toast()` from anywhere!

```vue
<script setup lang="ts">
    import { toast, Toaster } from '@spaneco/vue-hot-toast'
    import '@spaneco/vue-hot-toast/dist/vue-hot-toast.css'

    toast('Here is your toast.');
</script>

<template>
  <Toaster position="top-left"/>
</template>
```

## Documentation

Find the full API reference on [official documentation](https://react-hot-toast.com/docs).