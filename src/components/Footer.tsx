const Footer = () => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">IQ</span>
            </div>
            <span className="font-medium text-foreground text-sm">InterviewPrep</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-tertiary">
            © 2026 InterviewPrep
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
