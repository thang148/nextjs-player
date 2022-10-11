module.exports = {
  rules: [
    {
      regex: "/video.*",
      ttl: 30,
    },
    {
      regex: "/detail-livescore.*",
      ttl: 30,
    },
    {
      regex: "/404",
      ttl: 7200,
    },
    {
      regex: "/android",
      ttl: 7200,
    },
    {
      regex: "/ios",
      ttl: 7200,
    },
    {
      regex: "/chinh-sach",
      ttl: 7200,
    },
    {
      regex: "/chinh-sach-app",
      ttl: 7200,
    },
    {
      regex: "/dieu-khoan-app",
      ttl: 7200,
    },
    {
      regex: "/profile",
      ttl: 60,
    },
    {
      regex: "/livescore",
      ttl: 30,
    },
  ],
}
